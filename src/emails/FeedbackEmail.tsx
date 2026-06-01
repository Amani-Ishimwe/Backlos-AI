import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Heading,
  Hr,
} from "@react-email/components";

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

export const FeedbackEmail: React.FC<FeedbackEmailProps> = ({
  applicantName = "Jane Doe",
  programName = "Buildathon 2026",
  orgName = "HackerOrg",
  status = "REJECTED",
  overallPercentile = 87.5,
  summary = "We were deeply impressed by your core technical execution. You demonstrated remarkable agility in structuring your database logic.",
  strengthHighlight = "Excellent architectural layering of background worker processes.",
  criteriaBreakdown = [
    { criteriaName: "Technical Depth", score: 85, percentile: 90 },
    { criteriaName: "Design & UX", score: 70, percentile: 65 },
  ],
  improvementAreas = [
    "Refining the asynchronous client error catching hooks.",
    "Ensuring input variables are cast securely on backend schemas.",
  ],
  nextSteps = [
    "Take our advanced TypeScript database optimization module.",
    "Refactor your API routes to leverage cache edge nodes.",
  ],
  reportUrl = "http://localhost:3000/feedback/mock-id/mock-token",
}) => {
  const isAccepted = status === "ACCEPTED";

  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
          body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        `}</style>
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Logo & Header */}
          <Section style={headerSection}>
            <div style={logoWrapper}>
              <span style={logoCircle}>↺</span>
              <span style={logoText}>Backlos</span>
            </div>
            <Text style={orgAttribution}>partnering with <strong>{orgName}</strong></Text>
          </Section>

          {/* Banner */}
          <Section style={banner}>
            <Heading style={bannerHeading}>Your {programName} feedback is ready</Heading>
          </Section>

          {/* Body Box */}
          <Section style={contentBox}>
            <Text style={greeting}>Hi {applicantName},</Text>
            <Text style={introText}>
              Every single applicant deserves closure. We are proud to partner with{" "}
              <strong>{orgName}</strong> to ensure you receive clear, constructive feedback on your
              submission.
            </Text>

            {/* Decision Pill */}
            <div style={pillContainer}>
              {isAccepted ? (
                <span style={acceptedPill}>Accepted 🎉</span>
              ) : (
                <span style={neutralPill}>Application Reviewed</span>
              )}
            </div>

            {/* Percentile Callout */}
            <Section style={percentileCallout}>
              <Text style={percentileText}>
                You scored in the top <strong>{Math.round(100 - overallPercentile)}%</strong> of all applicants
              </Text>
            </Section>

            {/* Summary */}
            <Heading as="h3" style={sectionTitle}>Submission Summary</Heading>
            <Text style={bodyText}>{summary}</Text>

            {/* Strength Highlight */}
            <Section style={strengthBox}>
              <Text style={strengthTitle}>
                <span style={sparkleIcon}>✦</span> Key Strength Highlight
              </Text>
              <Text style={strengthContent}>{strengthHighlight}</Text>
            </Section>

            <Hr style={divider} />

            {/* Criteria table */}
            <Heading as="h3" style={sectionTitle}>Criteria Scores Profile</Heading>
            <table style={scoreTable}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={tableHeaderCell}>Rubric Criterion</th>
                  <th style={{ ...tableHeaderCell, textAlign: "right" }}>Score</th>
                  <th style={{ ...tableHeaderCell, textAlign: "right" }}>Percentile</th>
                </tr>
              </thead>
              <tbody>
                {criteriaBreakdown.map((c, i) => (
                  <tr key={i} style={i % 2 === 0 ? tableRowEven : tableRowOdd}>
                    <td style={tableCell}><strong>{c.criteriaName}</strong></td>
                    <td style={{ ...tableCell, textAlign: "right" }}>{c.score}/100</td>
                    <td style={{ ...tableCell, textAlign: "right" }}>{c.percentile}th</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Hr style={divider} />

            {/* Improvement Areas */}
            <Heading as="h3" style={sectionTitle}>Suggested Focus Areas</Heading>
            <ol style={listOrdered}>
              {improvementAreas.map((area, i) => (
                <li key={i} style={listItem}>
                  {area}
                </li>
              ))}
            </ol>

            {/* Next Steps */}
            <Heading as="h3" style={sectionTitle}>Actionable Next Steps</Heading>
            <ul style={listUnordered}>
              {nextSteps.map((step, i) => (
                <li key={i} style={listItem}>
                  👉 {step}
                </li>
              ))}
            </ul>

            <Hr style={divider} />

            {/* CTA Button */}
            <Section style={ctaContainer}>
              <Button href={reportUrl} style={ctaButton}>
                View Your Full Report →
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Powered by <strong>Backlos</strong>. Every single applicant deserves closure.
            </Text>
            <Text style={footerSubtext}>
              You received this feedback because you submitted an application to {programName} hosted by {orgName}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FeedbackEmail;

// Email styling rules
const main = {
  backgroundColor: "#FAFAFC",
  padding: "40px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "14px",
  border: "1.5px solid #C4C0FF",
  boxShadow: "0 4px 20px rgba(108, 99, 255, 0.05)",
  overflow: "hidden" as const,
};

const headerSection = {
  padding: "24px 32px 16px 32px",
  backgroundColor: "#FFFFFF",
  borderBottom: "1px solid #F0EFFF",
};

const logoWrapper = {
  display: "inline-flex",
  alignItems: "center",
};

const logoCircle = {
  display: "inline-block",
  width: "28px",
  height: "28px",
  backgroundColor: "#6C63FF",
  color: "#FFFFFF",
  borderRadius: "50%",
  textAlign: "center" as const,
  lineHeight: "28px",
  fontSize: "18px",
  fontWeight: "bold",
  marginRight: "8px",
};

const logoText = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1A1A2E",
  letterSpacing: "-0.5px",
};

const orgAttribution = {
  float: "right" as const,
  fontSize: "12px",
  color: "#6B6B80",
  margin: "6px 0 0 0",
};

const banner = {
  backgroundColor: "#6C63FF",
  padding: "32px",
  textAlign: "center" as const,
};

const bannerHeading = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
  lineHeight: "1.3",
};

const contentBox = {
  padding: "32px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1A1A2E",
  margin: "0 0 12px 0",
};

const introText = {
  fontSize: "15px",
  color: "#6B6B80",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const pillContainer = {
  margin: "0 0 24px 0",
};

const acceptedPill = {
  backgroundColor: "#D1FAE5",
  color: "#065F46",
  padding: "6px 14px",
  borderRadius: "99px",
  fontSize: "13px",
  fontWeight: "600",
  display: "inline-block",
  border: "1px solid #A7F3D0",
};

const neutralPill = {
  backgroundColor: "#F0EFFF",
  color: "#6C63FF",
  padding: "6px 14px",
  borderRadius: "99px",
  fontSize: "13px",
  fontWeight: "600",
  display: "inline-block",
  border: "1px solid #C4C0FF",
};

const percentileCallout = {
  backgroundColor: "#F0EFFF",
  borderRadius: "8px",
  padding: "16px",
  borderLeft: "4px solid #6C63FF",
  margin: "0 0 28px 0",
};

const percentileText = {
  color: "#1A1A2E",
  fontSize: "15px",
  margin: 0,
};

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  color: "#6C63FF",
  margin: "24px 0 12px 0",
};

const bodyText = {
  fontSize: "15px",
  color: "#1A1A2E",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const strengthBox = {
  backgroundColor: "#F0EFFF",
  borderRadius: "8px",
  padding: "16px",
  border: "1px dashed #C4C0FF",
  margin: "20px 0",
};

const strengthTitle = {
  color: "#6C63FF",
  fontWeight: "600",
  fontSize: "14px",
  margin: "0 0 6px 0",
  display: "flex",
  alignItems: "center",
};

const sparkleIcon = {
  marginRight: "6px",
  fontSize: "16px",
};

const strengthContent = {
  color: "#1A1A2E",
  fontSize: "14px",
  margin: 0,
  lineHeight: "1.5",
};

const divider = {
  borderColor: "#F0EFFF",
  margin: "28px 0",
};

const scoreTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
  margin: "12px 0 20px 0",
};

const tableHeaderRow = {
  borderBottom: "2px solid #C4C0FF",
};

const tableHeaderCell = {
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#6C63FF",
  textTransform: "uppercase" as const,
  textAlign: "left" as const,
};

const tableRowEven = {
  backgroundColor: "#FDFDFD",
  borderBottom: "1px solid #F0EFFF",
};

const tableRowOdd = {
  backgroundColor: "#FAFAFC",
  borderBottom: "1px solid #F0EFFF",
};

const tableCell = {
  padding: "12px",
  fontSize: "14px",
  color: "#1A1A2E",
};

const listOrdered = {
  margin: "0 0 20px 0",
  paddingLeft: "20px",
};

const listUnordered = {
  margin: "0 0 20px 0",
  paddingLeft: "0",
  listStyleType: "none",
};

const listItem = {
  fontSize: "14px",
  color: "#1A1A2E",
  lineHeight: "1.6",
  marginBottom: "8px",
};

const ctaContainer = {
  textAlign: "center" as const,
  margin: "28px 0 10px 0",
};

const ctaButton = {
  backgroundColor: "#6C63FF",
  color: "#FFFFFF",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "15px",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};

const footer = {
  backgroundColor: "#1A1A2E",
  padding: "32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#FFFFFF",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const footerSubtext = {
  color: "#6B6B80",
  fontSize: "11px",
  margin: 0,
  lineHeight: "1.4",
};
