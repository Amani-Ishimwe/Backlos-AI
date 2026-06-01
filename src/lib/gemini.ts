import Groq from "groq-sdk";
import prisma from "./prisma";
import {
  calculateMean,
  calculateStandardDeviation,
  calculatePercentile,
} from "../utils/poolStats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

/**
 * Calculates statistical metrics for all applicants in a program.
 */
async function getProgramPoolStats(programId: string) {
  const applicants = await prisma.applicant.findMany({
    where: { programId },
    include: {
      scores: {
        include: {
          criteria: true,
        },
      },
    },
  });

  const criteria = await prisma.rubricCriteria.findMany({
    where: { programId },
  });

  const applicantWeightedScores: { id: string; score: number }[] = [];
  const criteriaScoresMap: Record<string, number[]> = {};

  criteria.forEach((c) => {
    criteriaScoresMap[c.id] = [];
  });

  applicants.forEach((app) => {
    let weightedSum = 0;

    app.scores.forEach((s) => {
      const scoreVal = s.score;
      const weight = s.criteria.weight;
      weightedSum += (scoreVal * weight) / 100;

      if (criteriaScoresMap[s.criteriaId]) {
        criteriaScoresMap[s.criteriaId].push(scoreVal);
      }
    });

    applicantWeightedScores.push({ id: app.id, score: weightedSum });
  });

  return {
    applicantsCount: applicants.length,
    criteriaScoresMap,
    applicantWeightedScores,
    criteria,
  };
}

/**
 * Generates highly personalized, premium AI feedback for a single applicant using Groq (Llama 3.3 70B).
 * Calculates pool statistics and uses Groq in JSON mode to compile a structured report.
 * @param applicantId Unique ID of the applicant.
 */
export async function generateFeedbackForApplicant(applicantId: string) {
  try {
    // 1. Fetch applicant with scores
    const applicant = await prisma.applicant.findFirst({
      where: { id: applicantId },
      include: {
        scores: {
          include: {
            criteria: true,
          },
        },
        program: true,
      },
    });

    if (!applicant) {
      throw new Error(`Applicant not found: ${applicantId}`);
    }

    const { programId } = applicant;

    // 2. Fetch and calculate program pool statistics
    const stats = await getProgramPoolStats(programId);

    // Calculate overall applicant score
    let applicantWeightedScore = 0;
    applicant.scores.forEach((s) => {
      applicantWeightedScore += (s.score * s.criteria.weight) / 100;
    });

    const allWeightedScores = stats.applicantWeightedScores.map((x) => x.score);
    const overallPercentile = calculatePercentile(applicantWeightedScore, allWeightedScores);

    // Build stats for each criterion
    const criteriaDetails = stats.criteria.map((c) => {
      const allScores = stats.criteriaScoresMap[c.id] || [];
      const mean = calculateMean(allScores);
      const stdDev = calculateStandardDeviation(allScores, mean);
      const appScoreObj = applicant.scores.find((s) => s.criteriaId === c.id);
      const appScore = appScoreObj ? appScoreObj.score : 0;
      const percentile = calculatePercentile(appScore, allScores);

      return {
        id: c.id,
        name: c.name,
        description: c.description || "No description provided",
        weight: c.weight,
        score: appScore,
        avg: mean,
        stdDev,
        percentile,
      };
    });

    const judgeNotesCombined = applicant.scores
      .map((s) => s.judgeNotes)
      .filter((n) => n && n.trim())
      .join(" | ");

    // 3. Build AI Generation Prompt
    const systemPrompt = `You are a B2B SaaS feedback specialist who writes constructive, specific, and encouraging application feedback. 
Always be honest but kind. Never be generic or vague. Write in the requested tone preference.
Return ONLY valid JSON matching the exact schema specified, with no explanations.`;

    const userPrompt = `
System Context: ${systemPrompt}

Program: ${applicant.program.name} (${applicant.program.type})
Tone Preference: ${applicant.program.tonePreference}
Decision Status: ${applicant.status}

Evaluation rubric:
${criteriaDetails.map((c) => `- ${c.name} (${c.weight}% weight): ${c.description}`).join("\n")}

This applicant's scores vs pool statistics:
${criteriaDetails
  .map(
    (c) =>
      `- ${c.name}: ${c.score}/100 | Pool average: ${c.avg} | Their percentile: ${c.percentile}th percentile`
  )
  .join("\n")}

${judgeNotesCombined ? `Judge evaluation notes (use as core context, do NOT quote directly): ${judgeNotesCombined}` : ""}

Return a JSON object adhering exactly to this TypeScript structure:
{
  "summary": "2-3 sentences summarizing what stood out about this application overall. Write in the chosen tone.",
  "strengthHighlight": "The single most impressive thing about this application in one sentence.",
  "improvementAreas": [
    "specific thing to improve 1",
    "specific thing to improve 2",
    "specific thing to improve 3"
  ],
  "nextSteps": [
    "concrete actionable step 1",
    "concrete actionable step 2"
  ],
  "criteriaBreakdown": [
    ${criteriaDetails
      .map(
        (c) => `{
      "criteriaName": "${c.name}",
      "score": ${c.score},
      "percentile": ${c.percentile},
      "insight": "one specific sentence detailing their performance on this criteria relative to the averages."
    }`
      )
      .join(",\n")}
  ],
  "overallPercentile": ${overallPercentile}
}
`;

    // Use Groq's llama-3.3-70b-versatile — free tier: 14,400 req/day, 30 RPM
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawText = completion.choices[0]?.message?.content?.trim();
    if (!rawText) {
      throw new Error("Groq returned an empty response.");
    }

    // 5. Parse JSON Response
    const reportData = JSON.parse(rawText);

    // 6. Save FeedbackReport to database
    const feedbackReport = await prisma.feedbackReport.upsert({
      where: { applicantId: applicant.id },
      update: {
        summary: reportData.summary,
        strengthHighlight: reportData.strengthHighlight,
        improvementAreas: reportData.improvementAreas,
        nextSteps: reportData.nextSteps,
        criteriaBreakdown: reportData.criteriaBreakdown,
        overallPercentile: reportData.overallPercentile,
        status: "READY",
        generatedAt: new Date(),
      },
      create: {
        applicantId: applicant.id,
        summary: reportData.summary,
        strengthHighlight: reportData.strengthHighlight,
        improvementAreas: reportData.improvementAreas,
        nextSteps: reportData.nextSteps,
        criteriaBreakdown: reportData.criteriaBreakdown,
        overallPercentile: reportData.overallPercentile,
        status: "READY",
        generatedAt: new Date(),
      },
    });

    return feedbackReport;
  } catch (error: any) {
    console.error("AI Generation Error for applicant:", applicantId, error);

    // Save report in ERROR status
    await prisma.feedbackReport.upsert({
      where: { applicantId },
      update: {
        summary: "Error occurred during Gemini AI feedback generation.",
        strengthHighlight: "Error occurred.",
        improvementAreas: [],
        nextSteps: [],
        criteriaBreakdown: [],
        overallPercentile: 0,
        status: "ERROR",
      },
      create: {
        applicantId,
        summary: "Error occurred during Gemini AI feedback generation.",
        strengthHighlight: "Error occurred.",
        improvementAreas: [],
        nextSteps: [],
        criteriaBreakdown: [],
        overallPercentile: 0,
        status: "ERROR",
      },
    });

    throw error;
  }
}
