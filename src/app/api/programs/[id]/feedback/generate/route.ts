import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { generateFeedbackForApplicant } from "@/lib/gemini";
import { getPlanDetails } from "@/lib/stripe";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/programs/[id]/feedback/generate
//   - No query param  → batch generation for all applicants
//   - ?applicantId=xx → single synchronous regeneration
//   - ?_internal=1    → internal worker call that does the actual generation
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const applicantId = searchParams.get("applicantId");
  const isInternal = searchParams.get("_internal") === "1";

  // ── Internal worker: runs actual generation, called from the kickoff below ──
  if (isInternal) {
    const body = await request.json().catch(() => ({}));
    const { applicantIds, programId } = body as {
      applicantIds: string[];
      programId: string;
    };

    if (!applicantIds?.length || !programId) {
      return NextResponse.json({ ok: false });
    }

    // Helper: parse retryDelay from a Gemini 429 error message (e.g. "Please retry in 46.5s")
    const getRetryDelay = (err: any): number => {
      try {
        const msg = typeof err === "string" ? err : JSON.stringify(err);
        const match = msg.match(/retryDelay[": ]+(\d+)/);
        if (match) return parseInt(match[1], 10) * 1000 + 2000; // add 2s buffer
      } catch (_) {}
      return 60_000; // default 60s if we can't parse
    };

    // Process one applicant with up to 3 retries on rate limit
    const generateWithRetry = async (id: string, attempt = 0): Promise<void> => {
      try {
        await generateFeedbackForApplicant(id);
        console.log(`[Worker] ✓ ${id}`);
      } catch (err: any) {
        const errStr = typeof err === "string" ? err : JSON.stringify(err);
        const isRateLimit = err?.status === 429 || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");

        if (isRateLimit && attempt < 3) {
          const delay = getRetryDelay(errStr);
          console.log(`[Worker] Rate limited on ${id}, waiting ${delay / 1000}s then retrying (attempt ${attempt + 1}/3)...`);
          await new Promise((r) => setTimeout(r, delay));
          return generateWithRetry(id, attempt + 1);
        }

        console.error(`[Worker] ✗ ${id}:`, errStr.slice(0, 200));
      }
    };

    // Run in parallel with a concurrency limit of 8
    const limit = 8;
    let index = 0;
    const worker = async () => {
      while (index < applicantIds.length) {
        const currentId = applicantIds[index++];
        if (!currentId) break;
        await generateWithRetry(currentId);
      }
    };

    const workers = Array.from({ length: Math.min(limit, applicantIds.length) }, worker);
    await Promise.all(workers);

    try {
      await prisma.program.update({
        where: { id: programId },
        data: { status: "ACTIVE" },
      });
    } catch (_) {}

    return NextResponse.json({ ok: true });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    include: { org: true },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "No organization membership found" },
      { status: 403 }
    );
  }

  const { org } = membership;

  const program = await prisma.program.findFirst({
    where: { id: params.id, orgId: org.id },
    include: { criteria: true, applicants: true },
  });

  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  // Validation
  if (program.criteria.length === 0) {
    return NextResponse.json(
      { error: "Program has no rubric criteria defined." },
      { status: 400 }
    );
  }

  const totalWeight = program.criteria.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight !== 100) {
    return NextResponse.json(
      { error: "Weights must sum to exactly 100%." },
      { status: 400 }
    );
  }

  if (program.applicants.length === 0) {
    return NextResponse.json(
      { error: "Roster is empty. Please upload applicant scores first." },
      { status: 400 }
    );
  }

  // ── Single applicant synchronous regeneration ────────────────────────────
  if (applicantId) {
    const applicant = program.applicants.find((a) => a.id === applicantId);
    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found in this program" },
        { status: 404 }
      );
    }
    const report = await generateFeedbackForApplicant(applicantId);
    return NextResponse.json({ success: true, data: report });
  }

  // ── Batch generation kickoff ──────────────────────────────────────────────
  const applicantIds = program.applicants.map((a) => a.id);

  // Reset all non-SENT reports to GENERATING so the status page shows progress
  await prisma.$transaction(
    applicantIds.map((id) =>
      prisma.feedbackReport.upsert({
        where: { applicantId: id },
        update: { status: "GENERATING" },
        create: {
          applicantId: id,
          status: "GENERATING",
          summary: "",
          strengthHighlight: "",
          criteriaBreakdown: [],
          improvementAreas: [],
          nextSteps: [],
          overallPercentile: 0,
        },
      })
    )
  );

  console.log(
    `[Generate] Kicked off batch for ${applicantIds.length} applicants in program ${program.id}`
  );

  // Fire background generation in a non-blocking asynchronous event loop task.
  // This avoids loopback HTTP self-fetches which block Next.js dev server's single thread.
  (async () => {
    try {
      const getRetryDelay = (err: any): number => {
        try {
          const msg = typeof err === "string" ? err : JSON.stringify(err);
          const match = msg.match(/retryDelay[": ]+(\d+)/);
          if (match) return parseInt(match[1], 10) * 1000 + 2000;
        } catch (_) {}
        return 60_000;
      };

      const generateWithRetry = async (id: string, attempt = 0): Promise<void> => {
        try {
          await generateFeedbackForApplicant(id);
          console.log(`[Worker] ✓ ${id}`);
        } catch (err: any) {
          const errStr = typeof err === "string" ? err : JSON.stringify(err);
          const isRateLimit = err?.status === 429 || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");

          if (isRateLimit && attempt < 3) {
            const delay = getRetryDelay(errStr);
            console.log(`[Worker] Rate limited on ${id}, waiting ${delay / 1000}s then retrying (attempt ${attempt + 1}/3)...`);
            await new Promise((r) => setTimeout(r, delay));
            return generateWithRetry(id, attempt + 1);
          }

          console.error(`[Worker] ✗ ${id}:`, errStr.slice(0, 200));
        }
      };

      const limit = 8;
      let index = 0;
      const worker = async () => {
        while (index < applicantIds.length) {
          const currentId = applicantIds[index++];
          if (!currentId) break;
          await generateWithRetry(currentId);
        }
      };

      const workers = Array.from({ length: Math.min(limit, applicantIds.length) }, worker);
      await Promise.all(workers);

      await prisma.program.update({
        where: { id: program.id },
        data: { status: "ACTIVE" },
      });
      console.log(`[Worker] Background batch completed successfully for program ${program.id}`);
    } catch (e: any) {
      console.error("[Worker] Background batch execution crashed:", e.message);
    }
  })();

  return NextResponse.json({
    success: true,
    message: "Feedback generation started.",
    applicantCount: applicantIds.length,
  });
}
