import { inngest } from "../client";
import prisma from "../../prisma";
import { resend, FROM_EMAIL, APP_URL } from "../../resend";

/**
 * Ghost-Fighting daily automated cron job.
 * Runs every day at 08:00 UTC to prevent applicants from being ghosted.
 */
export const ghostFighting = inngest.createFunction(
  { 
    id: "ghost-fighting-mode",
    triggers: [{ cron: "0 8 * * *" }]
  },
  async ({ step }) => {
    // 1. Locate all programs past decision deadline where feedback has not been fully dispatched
    const overduePrograms = await step.run("fetch-overdue-programs", async () => {
      const now = new Date();
      
      const activePrograms = await prisma.program.findMany({
        where: {
          status: "ACTIVE",
          decisionDeadline: {
            lt: now
          }
        },
        include: {
          org: {
            include: {
              members: true
            }
          },
          applicants: {
            include: {
              emailDelivery: true
            }
          }
        }
      });

      // Filter to programs where at least one applicant is pending a sent feedback email
      return activePrograms.filter(program => {
        const unsentApplicants = program.applicants.filter(
          app => !app.emailDelivery || app.emailDelivery.status !== "SENT"
        );
        return unsentApplicants.length > 0;
      }).map(program => {
        const unsentCount = program.applicants.filter(
          app => !app.emailDelivery || app.emailDelivery.status !== "SENT"
        ).length;

        const daysOverdue = Math.floor(
          (now.getTime() - new Date(program.decisionDeadline!).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: program.id,
          name: program.name,
          decisionDeadline: program.decisionDeadline,
          unsentCount,
          daysOverdue,
          orgId: program.orgId,
          orgName: program.org.name,
          members: program.org.members.map(m => m.userId)
        };
      });
    });

    if (overduePrograms.length === 0) {
      return { status: "COMPLETED", message: "No overdue programs detected" };
    }

    // 2. Dispatch alert notifications to organizers
    const notificationsSent: any[] = [];
    for (const program of overduePrograms) {
      await step.run(`alert-organizer-program-${program.id}`, async () => {
        // Fetch organizer emails from Auth or OrgMember profiles
        const members = await prisma.orgMember.findMany({
          where: { orgId: program.orgId },
          // Mock fetch user profile email (we'll fetch actual email if saved, or default to mock admin)
        });

        // For B2B B&D compliance, send to representative emails or default user contact
        const recipient = "admin@backlos.app"; // Fallback placeholder
        const isSeverelyOverdue = program.daysOverdue >= 7;

        const subject = isSeverelyOverdue
          ? `🚨 CRITICAL: ${program.name} is ${program.daysOverdue} days past deadline — applicants are ghosted!`
          : `⚠️ ${program.unsentCount} applicants are still waiting for feedback — ${program.name}`;

        const body = `
          <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1.5px solid #C4C0FF; border-radius: 14px;">
            <h2 style="color: #1A1A2E;">Hello Organizer from ${program.orgName},</h2>
            <p style="color: #6B6B80; font-size: 16px; line-height: 1.5;">
              Our Backlos anti-ghosting engine detected that your program <strong>${program.name}</strong> was due to release feedback on 
              <strong>${new Date(program.decisionDeadline!).toLocaleDateString()}</strong> (which is <strong>${program.daysOverdue} days ago</strong>).
            </p>
            
            <div style="background-color: #F0EFFF; border-left: 4px solid #6C63FF; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <span style="color: #6C63FF; font-weight: bold; font-size: 18px;">${program.unsentCount} Applicants Ghosted</span>
              <p style="margin: 5px 0 0 0; color: #1A1A2E; font-size: 14px;">Every single applicant deserves closure. Let's send their personalized feedback reports now.</p>
            </div>

            <p style="color: #6B6B80; font-size: 14px; margin-bottom: 25px;">
              ${isSeverelyOverdue ? "<strong>Warning:</strong> You are in severe violation of public closure expectations. This will heavily negatively impact your organization's Accountability Score." : ""}
            </p>

            <a href="${APP_URL}/dashboard/programs/${program.id}/feedback" 
               style="background-color: #6C63FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Send Feedback Now
            </a>
            
            <footer style="margin-top: 40px; border-top: 1px solid #F0EFFF; padding-top: 20px; font-size: 12px; color: #6B6B80; text-align: center;">
              Powered by Backlos · Closure for every single applicant.
            </footer>
          </div>
        `;

        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: recipient,
            subject: subject,
            html: body,
          });
          notificationsSent.push({ id: program.id, status: "ALERTED" });
        } catch (e: any) {
          notificationsSent.push({ id: program.id, status: "FAILED", error: e.message });
        }
      });
    }

    return {
      status: "COMPLETED",
      scanned: overduePrograms.length,
      alerts: notificationsSent,
    };
  }
);
