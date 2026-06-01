import crypto from 'crypto';

const SECRET = process.env.FEEDBACK_TOKEN_SECRET || 'fallback-secret-key-change-in-production';

/**
 * Generates an HMAC-SHA256 token for a given applicant ID.
 * @param applicantId The ID of the applicant.
 * @returns Cryptographic hexadecimal token signature.
 */
export function generateReportToken(applicantId: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(applicantId)
    .digest('hex');
}

/**
 * Cryptographically verifies if the provided token matches the applicant ID.
 * Uses timingSafeEqual to protect against timing attacks.
 * @param applicantId The ID of the applicant.
 * @param token The token received in the URL.
 * @returns Boolean indicating if the token is valid.
 */
export function verifyReportToken(applicantId: string, token: string): boolean {
  const expectedToken = generateReportToken(applicantId);
  
  if (token.length !== expectedToken.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'utf-8'),
      Buffer.from(expectedToken, 'utf-8')
    );
  } catch (error) {
    return false;
  }
}
