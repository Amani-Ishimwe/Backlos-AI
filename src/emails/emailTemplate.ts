/**
 * Pure HTML email template for feedback reports.
 * Used instead of @react-email/render (which requires react-dom/server,
 * banned in Next.js App Router API routes).
 */

interface FeedbackEmailProps {
  applicantName: string;
  programName: string;
  orgName: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  overallPercentile: number;
  summary: string;
  strengthHighlight: string;
  criteriaBreakdown: { criteriaName: string; score: number; percentile: number }[];
  improvementAreas: string[];
  nextSteps: string[];
  reportUrl: string;
}

export function generateFeedbackEmailHtml(p: FeedbackEmailProps): string {
  const isAccepted = p.status === "ACCEPTED";
  const topPercent = Math.round(100 - p.overallPercentile);

  const criteriaRows = p.criteriaBreakdown
    .map(
      (c, i) => `
      <tr style="background:${i % 2 === 0 ? "#FDFDFD" : "#FAFAFC"};border-bottom:1px solid #F0EFFF;">
        <td style="padding:12px;font-size:14px;color:#1A1A2E;"><strong>${esc(c.criteriaName)}</strong></td>
        <td style="padding:12px;font-size:14px;color:#1A1A2E;text-align:right;">${c.score}/100</td>
        <td style="padding:12px;font-size:14px;color:#1A1A2E;text-align:right;">${c.percentile}th</td>
      </tr>`
    )
    .join("");

  const improvementItems = p.improvementAreas
    .map((a, i) => `<li style="font-size:14px;color:#1A1A2E;line-height:1.6;margin-bottom:8px;">${esc(a)}</li>`)
    .join("");

  const nextStepItems = p.nextSteps
    .map((s) => `<li style="font-size:14px;color:#1A1A2E;line-height:1.6;margin-bottom:8px;">👉 ${esc(s)}</li>`)
    .join("");

  const decisionPill = isAccepted
    ? `<span style="background:#D1FAE5;color:#065F46;padding:6px 14px;border-radius:99px;font-size:13px;font-weight:600;display:inline-block;border:1px solid #A7F3D0;">Accepted 🎉</span>`
    : `<span style="background:#F0EFFF;color:#6C63FF;padding:6px 14px;border-radius:99px;font-size:13px;font-weight:600;display:inline-block;border:1px solid #C4C0FF;">Application Reviewed</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your ${esc(p.programName)} Feedback</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
    body { font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin:0; padding:0; background:#FAFAFC; }
  </style>
</head>
<body style="background:#FAFAFC;padding:40px 0;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:14px;border:1.5px solid #C4C0FF;box-shadow:0 4px 20px rgba(108,99,255,0.05);overflow:hidden;">

    <!-- Header -->
    <div style="padding:24px 32px 16px 32px;background:#FFFFFF;border-bottom:1px solid #F0EFFF;">
      <span style="display:inline-block;width:28px;height:28px;background:#6C63FF;color:#FFF;border-radius:50%;text-align:center;line-height:28px;font-size:18px;font-weight:bold;margin-right:8px;">↺</span>
      <span style="font-size:22px;font-weight:700;color:#1A1A2E;letter-spacing:-0.5px;">Backlos</span>
      <span style="float:right;font-size:12px;color:#6B6B80;margin-top:6px;">partnering with <strong>${esc(p.orgName)}</strong></span>
    </div>

    <!-- Banner -->
    <div style="background:#6C63FF;padding:32px;text-align:center;">
      <h1 style="color:#FFFFFF;font-size:24px;font-weight:700;margin:0;line-height:1.3;">Your ${esc(p.programName)} feedback is ready</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="font-size:18px;font-weight:600;color:#1A1A2E;margin:0 0 12px 0;">Hi ${esc(p.applicantName)},</p>
      <p style="font-size:15px;color:#6B6B80;line-height:1.6;margin:0 0 24px 0;">
        Every single applicant deserves closure. We are proud to partner with <strong>${esc(p.orgName)}</strong> to ensure you receive clear, constructive feedback on your submission.
      </p>

      <!-- Decision Pill -->
      <div style="margin:0 0 24px 0;">${decisionPill}</div>

      <!-- Percentile -->
      <div style="background:#F0EFFF;border-radius:8px;padding:16px;border-left:4px solid #6C63FF;margin:0 0 28px 0;">
        <p style="color:#1A1A2E;font-size:15px;margin:0;">
          You scored in the top <strong>${topPercent}%</strong> of all applicants
        </p>
      </div>

      <!-- Summary -->
      <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6C63FF;margin:24px 0 12px 0;">Submission Summary</h3>
      <p style="font-size:15px;color:#1A1A2E;line-height:1.6;margin:0 0 20px 0;">${esc(p.summary)}</p>

      <!-- Strength -->
      <div style="background:#F0EFFF;border-radius:8px;padding:16px;border:1px dashed #C4C0FF;margin:20px 0;">
        <p style="color:#6C63FF;font-weight:600;font-size:14px;margin:0 0 6px 0;">✦ Key Strength Highlight</p>
        <p style="color:#1A1A2E;font-size:14px;margin:0;line-height:1.5;">${esc(p.strengthHighlight)}</p>
      </div>

      <hr style="border-color:#F0EFFF;margin:28px 0;" />

      <!-- Criteria Table -->
      <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6C63FF;margin:24px 0 12px 0;">Criteria Scores Profile</h3>
      <table style="width:100%;border-collapse:collapse;margin:12px 0 20px 0;">
        <thead>
          <tr style="border-bottom:2px solid #C4C0FF;">
            <th style="padding:8px 12px;font-size:12px;font-weight:600;color:#6C63FF;text-transform:uppercase;text-align:left;">Rubric Criterion</th>
            <th style="padding:8px 12px;font-size:12px;font-weight:600;color:#6C63FF;text-transform:uppercase;text-align:right;">Score</th>
            <th style="padding:8px 12px;font-size:12px;font-weight:600;color:#6C63FF;text-transform:uppercase;text-align:right;">Percentile</th>
          </tr>
        </thead>
        <tbody>${criteriaRows}</tbody>
      </table>

      <hr style="border-color:#F0EFFF;margin:28px 0;" />

      <!-- Improvement Areas -->
      <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6C63FF;margin:24px 0 12px 0;">Suggested Focus Areas</h3>
      <ol style="margin:0 0 20px 0;padding-left:20px;">${improvementItems}</ol>

      <!-- Next Steps -->
      <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6C63FF;margin:24px 0 12px 0;">Actionable Next Steps</h3>
      <ul style="margin:0 0 20px 0;padding-left:0;list-style-type:none;">${nextStepItems}</ul>

      <hr style="border-color:#F0EFFF;margin:28px 0;" />

      <!-- CTA -->
      <div style="text-align:center;margin:28px 0 10px 0;">
        <a href="${p.reportUrl}" style="background:#6C63FF;color:#FFFFFF;border-radius:8px;font-weight:600;font-size:15px;padding:14px 28px;text-decoration:none;display:inline-block;">
          View Your Full Report →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1A1A2E;padding:32px;text-align:center;">
      <p style="color:#FFFFFF;font-size:14px;margin:0 0 8px 0;">Powered by <strong>Backlos</strong>. Every single applicant deserves closure.</p>
      <p style="color:#6B6B80;font-size:11px;margin:0;line-height:1.4;">
        You received this feedback because you submitted an application to ${esc(p.programName)} hosted by ${esc(p.orgName)}.
      </p>
    </div>

  </div>
</body>
</html>`;
}

/** Escape HTML special characters to prevent XSS in emails */
function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
