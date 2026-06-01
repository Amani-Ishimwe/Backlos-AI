/**
 * Computes statistical analytics for a pool of applicant scores.
 */

export interface ScoreItem {
  applicantId: string;
  score: number;
}

export interface CriterionStats {
  mean: number;
  stdDev: number;
}

/**
 * Calculates the mean average of a list of scores.
 */
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return Number((sum / scores.length).toFixed(2));
}

/**
 * Calculates the population standard deviation of a list of scores.
 */
export function calculateStandardDeviation(scores: number[], mean: number): number {
  if (scores.length <= 1) return 0;
  const squareDiffs = scores.map((score) => Math.pow(score - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / scores.length;
  return Number(Math.sqrt(avgSquareDiff).toFixed(2));
}

/**
 * Calculates the percentile rank of a score within a pool.
 * Standard percentile rank formula:
 * PR = ((L + 0.5 * S) / N) * 100
 * where L is count of scores less than the score, S is count of scores equal, N is total.
 */
export function calculatePercentile(targetScore: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;
  
  let lessThanCount = 0;
  let equalCount = 0;

  for (const score of allScores) {
    if (score < targetScore) {
      lessThanCount++;
    } else if (score === targetScore) {
      equalCount++;
    }
  }

  const percentile = ((lessThanCount + 0.5 * equalCount) / allScores.length) * 100;
  return Number(percentile.toFixed(1));
}

/**
 * Calculates the overall percentile rank for an applicant based on weighted scores.
 */
export function calculateOverallPercentile(
  applicantWeightedScore: number,
  allApplicantsWeightedScores: number[]
): number {
  return calculatePercentile(applicantWeightedScore, allApplicantsWeightedScores);
}
