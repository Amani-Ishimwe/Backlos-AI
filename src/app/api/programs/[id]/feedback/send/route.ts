import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { resend, FROM_EMAIL, APP_URL } from "@/lib/resend";
import { generateReportToken } from "@/utils/reportToken";
import { generateFeedbackEmailHtml } from "@/emails/emailTemplate";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
      include: {
        org: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    const { org } = membership;

    // Verify program belongs to this organization
    const program = await prisma.program.findFirst({
      where: {
        id: params.id,
        orgId: org.id,
      },
      include: {
        applicants: {
          include: {
            report: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Filter to applicants that have reports ready
    const eligibleApplicants = program.applicants.filter(
      (app) => app.report && app.report.status === "READY"
    );

    if (eligibleApplicants.length === 0) {
      return NextResponse.json(
        { error: "No feedback reports are in READY status. Please compile AI feedback first." },
        { status: 400 }
      );
    }

    const batchEmails = eligibleApplicants.map((applicant) => {
      const report = applicant.report!;
      const token = generateReportToken(applicant.id);
      const reportUrl = `${APP_URL}/feedback/${applicant.id}/${token}`;

      const breakdown = (report.criteriaBreakdown as any[]) || [];
      const criteriaMap = breakdown.map((c: any) => ({
        criteriaName: c.criteriaName,
        score: c.score,
        percentile: c.percentile,
      }));

      // Generate HTML directly — no React rendering required (banned in App Router)
      const html = generateFeedbackEmailHtml({
        applicantName: applicant.name,
        programName: program.name,
        orgName: org.name,
        status: applicant.status,
        overallPercentile: report.overallPercentile,
        summary: report.summary,
        strengthHighlight: report.strengthHighlight,
        criteriaBreakdown: criteriaMap,
        improvementAreas: (report.improvementAreas as string[]) || [],
        nextSteps: (report.nextSteps as string[]) || [],
        reportUrl,
      });

      // DEV MODE: All emails redirected to Resend test inbox.
      // Remove this block and use `applicant.email` when going to production.
      const toEmail = "delivered@resend.dev";
      console.log(`[Send] DEV: ${applicant.email} → delivered@resend.dev`);

      return {
        from: FROM_EMAIL,
        to: toEmail,
        subject: `Your ${program.name} feedback is ready`,
        html,
      };
    });


    let sent = 0;

    // 1. Send all personalized emails in a single batch request
    const { data, error } = await resend.batch.send(batchEmails);

    if (error) {
      console.error("Resend batch dispatch failed:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    sent = data ? data.length : eligibleApplicants.length;

    // 2. Prepare database updates in a single batch operations array
    const dbOperations: any[] = [];
    eligibleApplicants.forEach((applicant) => {
      const report = applicant.report!;
      dbOperations.push(
        prisma.emailDelivery.upsert({
          where: { applicantId: applicant.id },
          update: {
            status: "SENT",
            sentAt: new Date(),
          },
          create: {
            applicantId: applicant.id,
            status: "SENT",
            sentAt: new Date(),
          },
        })
      );
      dbOperations.push(
        prisma.feedbackReport.update({
          where: { id: report.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        })
      );
    });

    // 3. Execute all database updates in a single PgBouncer-compatible transaction
    await prisma.$transaction(dbOperations);

    // Automatically change program status to CLOSED after bulk dispatching feedback reports!
    await prisma.program.update({
      where: { id: program.id },
      data: { status: "CLOSED" },
    });

    return NextResponse.json({
      success: true,
      data: { sent },
    });
  } catch (error: any) {
    console.error("Batch dispatcher execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
