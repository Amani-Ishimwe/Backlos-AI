export type Plan = 'FREE' | 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE';
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';
export type ProgramType = 'HACKATHON' | 'ACCELERATOR' | 'GRANT' | 'JOB' | 'FELLOWSHIP' | 'AWARD' | 'OTHER';
export type ProgramStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';
export type Tone = 'FORMAL' | 'FRIENDLY' | 'CONCISE';
export type ApplicantStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type ReportStatus = 'GENERATING' | 'READY' | 'SENT' | 'ERROR';
export type DeliveryStatus = 'PENDING' | 'SENT' | 'BOUNCED' | 'OPENED';

export interface Org {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  plan: Plan;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  feedbackDeliveryScore: number;
  createdAt: Date;
}

export interface OrgMember {
  id: string;
  orgId: string;
  userId: string;
  role: Role;
  createdAt: Date;
}

export interface Program {
  id: string;
  orgId: string;
  name: string;
  type: ProgramType;
  status: ProgramStatus;
  tonePreference: Tone;
  decisionDeadline?: Date | null;
  createdAt: Date;
}

export interface RubricCriteria {
  id: string;
  programId: string;
  name: string;
  weight: number;
  description?: string | null;
}

export interface Applicant {
  id: string;
  programId: string;
  name: string;
  email: string;
  status: ApplicantStatus;
  submissionText?: string | null;
  createdAt: Date;
}

export interface ApplicantScore {
  id: string;
  applicantId: string;
  criteriaId: string;
  score: number;
  judgeNotes?: string | null;
}

export interface CriteriaBreakdownItem {
  criteriaName: string;
  score: number;
  percentile: number;
  insight: string;
}

export interface FeedbackReport {
  id: string;
  applicantId: string;
  summary: string;
  strengthHighlight: string;
  improvementAreas: string[];
  nextSteps: string[];
  criteriaBreakdown: CriteriaBreakdownItem[];
  overallPercentile: number;
  status: ReportStatus;
  generatedAt?: Date | null;
  sentAt?: Date | null;
}

export interface EmailDelivery {
  id: string;
  applicantId: string;
  status: DeliveryStatus;
  sentAt?: Date | null;
  openedAt?: Date | null;
}

// API schemas and standard response shapes
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}
export interface UploadApplicantsResponse {
  created: number;
  updated: number;
  errors: string[];
}
