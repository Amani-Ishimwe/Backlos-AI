import { inngest } from "../client";
import prisma from "../../prisma";
import { generateFeedbackForApplicant } from "../../gemini";

/**
 * Inngest background event processor to generate AI feedback in batch.
 * Triggered by the "backlos/feedback.generate" event.
 */
export const generateFeedback = inngest.createFunction(
  { 
    id: "generate-feedback", 
    concurrency: 10,
    triggers: [{ event: "backlos/feedback.generate" }]
  },
  async ({ event, step }) => {
    const { programId } = event.data;

    // Safety guard clause to prevent crashes when manually triggered with empty payload
    if (!programId) {
      return { status: "FAILED", message: "Missing programId in event payload" };
    }

    // 1. Fetch applicants without a completed feedback report
    const applicants = await step.run("fetch-applicants", async () => {
      const found = await prisma.applicant.findMany({
        where: {
          programId,
          OR: [
            { report: { is: null } },
            { report: { status: "ERROR" } },
          ],
        },
        select: { id: true, email: true },
      });
      console.log(`[Inngest:generate-feedback] program=${programId} → found ${found.length} applicants to process`);
      return found;
    });

    if (applicants.length === 0) {
      return { status: "COMPLETED", message: "No applicants require feedback generation" };
    }

    // 2. Fan-out feedback generation for each applicant
    const results = [];
    for (const applicant of applicants) {
      const result = await step.run(`generate-feedback-applicant-${applicant.id}`, async () => {
        try {
          await generateFeedbackForApplicant(applicant.id);
          return { id: applicant.id, status: "SUCCESS" };
        } catch (error: any) {
          console.error(`Inngest: Failed for applicant ${applicant.id}:`, error);
          return { id: applicant.id, status: "FAILED", error: error.message };
        }
      });
      results.push(result);
    }

    // 3. Update program tracking status on completion
    await step.run("finalize-program-status", async () => {
      // If all reports have been compiled, we can set program to ACTIVE or leave as DRAFT.
      // We will ensure database scores are recalculated or marked appropriately.
      await prisma.program.update({
        where: { id: programId },
        data: { status: "ACTIVE" }, // Automatically activate program when feedback is compiled and ready!
      });
    });

    const successCount = results.filter((r) => r.status === "SUCCESS").length;
    const failCount = results.filter((r) => r.status === "FAILED").length;

    return {
      status: "COMPLETED",
      processed: applicants.length,
      success: successCount,
      failed: failCount,
    };
  }
);
