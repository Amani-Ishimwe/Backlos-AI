import { ApplicantStatus } from '../types';

export interface CSVApplicantRow {
  name: string;
  email: string;
  status: string; // PENDING | ACCEPTED | REJECTED
  scores: Record<string, number>; // criteriaName -> score value (0-100)
  judgeNotes?: string;
}

export interface CSVValidationError {
  row: number;
  email?: string;
  field: string;
  error: string;
}

/**
 * Validates a standard email format using standard regex.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates parsed CSV row data against Backlos schema.
 * @param row The raw parsed JSON row.
 * @param rowIndex The index of the row in the CSV file.
 * @param criteriaNames The criteria names defined in the program's rubric.
 * @returns Array of validation errors or empty array if valid.
 */
export function validateCSVRow(
  row: any,
  rowIndex: number,
  criteriaNames: string[]
): CSVValidationError[] {
  const errors: CSVValidationError[] = [];
  const name = row.name || row.Name || '';
  const email = row.email || row.Email || '';
  const status = (row.status || row.Status || 'PENDING').toUpperCase();
  const judgeNotes = row.judgeNotes || row.JudgeNotes || row.notes || row.Notes || '';

  if (!name.trim()) {
    errors.push({
      row: rowIndex + 1,
      email,
      field: 'name',
      error: 'Name is required'
    });
  }

  if (!email.trim()) {
    errors.push({
      row: rowIndex + 1,
      email,
      field: 'email',
      error: 'Email is required'
    });
  } else if (!isValidEmail(email)) {
    errors.push({
      row: rowIndex + 1,
      email,
      field: 'email',
      error: 'Invalid email address format'
    });
  }

  if (status !== 'PENDING' && status !== 'ACCEPTED' && status !== 'REJECTED') {
    errors.push({
      row: rowIndex + 1,
      email,
      field: 'status',
      error: 'Status must be ACCEPTED, REJECTED, or PENDING'
    });
  }

  // Validate criteria scores
  for (const criterion of criteriaNames) {
    // Attempt to locate score value in row keys case insensitively
    const matchKey = Object.keys(row).find(
      (k) => k.toLowerCase() === criterion.toLowerCase()
    );
    const scoreVal = matchKey ? parseFloat(row[matchKey]) : NaN;

    if (matchKey === undefined || isNaN(scoreVal)) {
      errors.push({
        row: rowIndex + 1,
        email,
        field: criterion,
        error: `Missing score for rubric criterion: "${criterion}"`
      });
    } else if (scoreVal < 0 || scoreVal > 100) {
      errors.push({
        row: rowIndex + 1,
        email,
        field: criterion,
        error: `Score for "${criterion}" must be a number between 0 and 100`
      });
    }
  }

  return errors;
}

/**
 * Parsers and parses raw applicant payload from client upload request.
 */
export function sanitizeApplicantUploadPayload(
  rawRows: any[],
  criteria: Array<{ id: string; name: string }>
): { sanitized: CSVApplicantRow[]; errors: string[] } {
  const sanitized: CSVApplicantRow[] = [];
  const errors: string[] = [];

  rawRows.forEach((row, index) => {
    const name = row.name || row.Name || '';
    const email = row.email || row.Email || '';
    const rawStatus = (row.status || row.Status || 'PENDING').toUpperCase();
    const judgeNotes = row.judgeNotes || row.JudgeNotes || row.notes || row.Notes || '';

    const status: ApplicantStatus = 
      rawStatus === 'ACCEPTED' ? 'ACCEPTED' : 
      rawStatus === 'REJECTED' ? 'REJECTED' : 'PENDING';

    const scores: Record<string, number> = {};
    let rowHasError = false;

    for (const c of criteria) {
      const matchKey = Object.keys(row).find(
        (k) => k.toLowerCase() === c.name.toLowerCase()
      );
      if (matchKey === undefined) {
        errors.push(`Row ${index + 1} (${email}): Missing score for criterion "${c.name}"`);
        rowHasError = true;
        continue;
      }
      const scoreVal = parseFloat(row[matchKey]);
      if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
        errors.push(`Row ${index + 1} (${email}): Score for "${c.name}" must be a number between 0 and 100`);
        rowHasError = true;
        continue;
      }
      scores[c.id] = scoreVal;
    }

    if (!isValidEmail(email)) {
      errors.push(`Row ${index + 1}: Invalid email address "${email}"`);
      rowHasError = true;
    }

    if (!name.trim()) {
      errors.push(`Row ${index + 1}: Missing name field`);
      rowHasError = true;
    }

    if (!rowHasError) {
      sanitized.push({
        name,
        email,
        status,
        scores,
        judgeNotes: judgeNotes ? String(judgeNotes).trim() : undefined
      });
    }
  });

  return { sanitized, errors };
}
