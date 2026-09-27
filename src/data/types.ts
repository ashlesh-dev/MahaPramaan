// ========================================
// Maha-Pramaan — Core Data Types
// ========================================

export type ApprovalStatus =
  | 'not_started'
  | 'in_progress'
  | 'under_review'
  | 'completed'
  | 'blocked'
  | 'renewal_due';

export type DocumentStatus = 'uploaded' | 'verified' | 'expired' | 'missing' | 'rejected';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export type UserRole = 'entrepreneur' | 'officer';

export interface Business {
  id: string;
  name: string;
  industry: string;
  location: string;
  district: string;
  state: string;
  investment: number;
  investmentLabel: string;
  employees: number;
  landType: string;
  builtUpArea: string;
  powerRequirement: string;
  waterConsumption: string;
  manufacturingActivity: string;
  businessStage: string;
  msme: boolean;
  manufacturingUnit: boolean;
  environmentalReview: boolean;
  factoryCompliance: boolean;
  fireSafetyReview: boolean;
  contactEmail: string;
  contactPhone: string;
  pan: string;
  gst: string;
  cin: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  category: string;
}

export interface Approval {
  id: string;
  name: string;
  departmentId: string;
  status: ApprovalStatus;
  progress: number;
  description: string;
  requiredDocumentIds: string[];
  dependencies: string[]; // IDs of approvals that must be completed first
  canParallelWith: string[]; // IDs of approvals that can run in parallel
  slaWorkingDays: number;
  category: string;
  renewalPeriodMonths?: number;
}

export interface Application {
  id: string;
  applicationNumber: string;
  businessId: string;
  approvalId: string;
  departmentId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'query_raised' | 'inspection_scheduled' | 'approved' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  expectedSlaDate: string;
  daysElapsed: number;
  progress: number;
  documentIds: string[];
  inspectionId?: string;
  timeline: TimelineEvent[];
  queryDetails?: QueryDetail;
  riskLevel: RiskLevel;
  riskIndicators: RiskIndicator[];
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface QueryDetail {
  query: string;
  raisedDate: string;
  responseDeadline: string;
  department: string;
}

export interface RiskIndicator {
  label: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadedDate?: string;
  verifiedDate?: string;
  expiryDate?: string;
  fileSize?: string;
  reusableIn: string[]; // approval IDs where this doc can be reused
  businessId: string;
}

export interface Inspection {
  id: string;
  businessId: string;
  applicationId: string;
  departmentId: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  inspectorName?: string;
  location: string;
  clusterOpportunity?: boolean;
}

export interface ComplianceItem {
  id: string;
  name: string;
  category: 'licences' | 'environmental' | 'safety' | 'labour' | 'renewals';
  status: 'compliant' | 'due_soon' | 'overdue' | 'not_applicable';
  dueDate: string;
  lastCompletedDate?: string;
  businessId: string;
  renewalPeriodMonths?: number;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  matchReasons: string[];
  requiredDocumentIds: string[];
  availableDocumentIds: string[];
  missingDocumentIds: string[];
  category: string;
  maxBenefit: string;
  eligibilityNote: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  date: string;
  read: boolean;
  actionUrl?: string;
  businessId: string;
  relatedEntityType?: 'application' | 'approval' | 'inspection' | 'compliance';
  relatedEntityId?: string;
}

export interface Grievance {
  id: string;
  applicationNumber: string;
  businessId: string;
  issue: string;
  currentStage: string;
  slaDays: number;
  elapsedDays: number;
  status: 'open' | 'escalated' | 'resolved' | 'closed';
  escalationLevel: number;
  timeline: TimelineEvent[];
}

export interface OfficerDashboardStats {
  totalApplications: number;
  pending: number;
  slaAtRisk: number;
  slaBreached: number;
  pipeline: {
    received: number;
    verification: number;
    scrutiny: number;
    inspection: number;
    decision: number;
  };
}

export interface BottleneckData {
  process: string;
  pending: number;
  avgDelay: number;
}

export interface SearchResult {
  type: 'application' | 'business' | 'document' | 'approval' | 'scheme';
  title: string;
  subtitle: string;
  url: string;
  id: string;
}
