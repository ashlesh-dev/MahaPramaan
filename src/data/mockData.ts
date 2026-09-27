// ========================================
// Maha-Pramaan — Mock Data
// ========================================
import type {
  Business, Department, Approval, Application, Document,
  Inspection, ComplianceItem, Scheme, Alert, Grievance,
  OfficerDashboardStats, BottleneckData
} from './types';

// ── DEPARTMENTS ──
export const departments: Department[] = [
  { id: 'dept-env', name: 'Maharashtra Pollution Control Board', shortName: 'MPCB', category: 'Environmental' },
  { id: 'dept-fire', name: 'Fire Department', shortName: 'Fire', category: 'Safety' },
  { id: 'dept-factory', name: 'Directorate of Industrial Safety & Health', shortName: 'DISH', category: 'Labour' },
  { id: 'dept-fssai', name: 'Food Safety & Standards Authority of India', shortName: 'FSSAI', category: 'Food Safety' },
  { id: 'dept-midc', name: 'Maharashtra Industrial Development Corporation', shortName: 'MIDC', category: 'Infrastructure' },
  { id: 'dept-mseb', name: 'Maharashtra State Electricity Board', shortName: 'MSEB', category: 'Utilities' },
  { id: 'dept-labour', name: 'Labour Commissioner Office', shortName: 'Labour', category: 'Labour' },
  { id: 'dept-gst', name: 'Goods & Services Tax Department', shortName: 'GST', category: 'Tax' },
  { id: 'dept-udyam', name: 'MSME Development Institute', shortName: 'MSME-DI', category: 'Registration' },
  { id: 'dept-legal', name: 'Legal Metrology Department', shortName: 'Legal Metrology', category: 'Compliance' },
  { id: 'dept-water', name: 'Water Resources Department', shortName: 'WRD', category: 'Utilities' },
  { id: 'dept-panchayat', name: 'Local Municipal Authority', shortName: 'Municipal', category: 'Local' },
];

// ── BUSINESS ──
export const demoBusiness: Business = {
  id: 'biz-001',
  name: 'Aarambh Foods Pvt. Ltd.',
  industry: 'Food Processing',
  location: 'Nashik, Maharashtra',
  district: 'Nashik',
  state: 'Maharashtra',
  investment: 24000000,
  investmentLabel: '₹2.4 Crore',
  employees: 38,
  landType: 'Industrial / MIDC',
  builtUpArea: '12,000 sq. ft.',
  powerRequirement: '250 kW',
  waterConsumption: '100 KL/day',
  manufacturingActivity: 'Food processing, packaging and cold storage',
  businessStage: 'Expansion / New Manufacturing Unit',
  msme: true,
  manufacturingUnit: true,
  environmentalReview: true,
  factoryCompliance: true,
  fireSafetyReview: true,
  contactEmail: 'demo@aarambhfoods.in',
  contactPhone: '+91 98765 43210',
  pan: 'AABCA1234F',
  gst: '27AABCA1234F1ZP',
  cin: 'U15400MH2024PTC123456',
};

// ── APPROVALS ──
export const approvals: Approval[] = [
  {
    id: 'appr-001',
    name: 'Pollution Consent (CTE/CTO)',
    departmentId: 'dept-env',
    status: 'under_review',
    progress: 65,
    description: 'Consent to Establish and Consent to Operate from Maharashtra Pollution Control Board for food processing manufacturing activities.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-land', 'doc-project', 'doc-machinery', 'doc-water'],
    dependencies: [],
    canParallelWith: ['appr-002', 'appr-004'],
    slaWorkingDays: 15,
    category: 'Environmental',
    renewalPeriodMonths: 60,
  },
  {
    id: 'appr-002',
    name: 'Fire Safety NOC',
    departmentId: 'dept-fire',
    status: 'in_progress',
    progress: 40,
    description: 'No Objection Certificate from the Fire Department for the manufacturing facility.',
    requiredDocumentIds: ['doc-pan', 'doc-land', 'doc-layout', 'doc-fire-plan'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-004'],
    slaWorkingDays: 10,
    category: 'Safety',
    renewalPeriodMonths: 12,
  },
  {
    id: 'appr-003',
    name: 'Factory Registration',
    departmentId: 'dept-factory',
    status: 'not_started',
    progress: 0,
    description: 'Factory registration under the Factories Act, 1948 for manufacturing operations.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-land', 'doc-layout', 'doc-company'],
    dependencies: ['appr-001', 'appr-002'],
    canParallelWith: [],
    slaWorkingDays: 20,
    category: 'Labour',
    renewalPeriodMonths: 12,
  },
  {
    id: 'appr-004',
    name: 'FSSAI Food Licence',
    departmentId: 'dept-fssai',
    status: 'in_progress',
    progress: 55,
    description: 'Central/State Food Safety licence for food manufacturing and processing activities.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project', 'doc-layout'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-002'],
    slaWorkingDays: 30,
    category: 'Food Safety',
  },
  {
    id: 'appr-005',
    name: 'MIDC Plot Allotment / Transfer',
    departmentId: 'dept-midc',
    status: 'completed',
    progress: 100,
    description: 'Industrial plot allotment from MIDC for setting up the manufacturing facility.',
    requiredDocumentIds: ['doc-pan', 'doc-company', 'doc-land'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-002', 'appr-004'],
    slaWorkingDays: 30,
    category: 'Infrastructure',
  },
  {
    id: 'appr-006',
    name: 'Power Connection (HT)',
    departmentId: 'dept-mseb',
    status: 'completed',
    progress: 100,
    description: 'High tension power connection for manufacturing operations.',
    requiredDocumentIds: ['doc-pan', 'doc-land', 'doc-company'],
    dependencies: ['appr-005'],
    canParallelWith: ['appr-001'],
    slaWorkingDays: 15,
    category: 'Utilities',
  },
  {
    id: 'appr-007',
    name: 'Water Connection Approval',
    departmentId: 'dept-water',
    status: 'in_progress',
    progress: 30,
    description: 'Industrial water supply connection for food processing activities.',
    requiredDocumentIds: ['doc-pan', 'doc-land', 'doc-water'],
    dependencies: ['appr-005'],
    canParallelWith: ['appr-001', 'appr-002'],
    slaWorkingDays: 15,
    category: 'Utilities',
  },
  {
    id: 'appr-008',
    name: 'Udyam Registration',
    departmentId: 'dept-udyam',
    status: 'completed',
    progress: 100,
    description: 'MSME registration under the Udyam framework.',
    requiredDocumentIds: ['doc-pan', 'doc-gst'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-002', 'appr-004'],
    slaWorkingDays: 1,
    category: 'Registration',
  },
  {
    id: 'appr-009',
    name: 'Labour Welfare Registration',
    departmentId: 'dept-labour',
    status: 'not_started',
    progress: 0,
    description: 'Registration under various labour welfare acts applicable to manufacturing units.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company'],
    dependencies: ['appr-003'],
    canParallelWith: [],
    slaWorkingDays: 10,
    category: 'Labour',
  },
  {
    id: 'appr-010',
    name: 'Legal Metrology Registration',
    departmentId: 'dept-legal',
    status: 'not_started',
    progress: 0,
    description: 'Registration for packaged goods under Legal Metrology Act.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project'],
    dependencies: ['appr-004'],
    canParallelWith: ['appr-003'],
    slaWorkingDays: 15,
    category: 'Compliance',
  },
  {
    id: 'appr-011',
    name: 'Trade Licence',
    departmentId: 'dept-panchayat',
    status: 'completed',
    progress: 100,
    description: 'Trade licence from the local municipal authority.',
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-land'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-002', 'appr-004'],
    slaWorkingDays: 7,
    category: 'Local',
  },
  {
    id: 'appr-012',
    name: 'GST Registration',
    departmentId: 'dept-gst',
    status: 'completed',
    progress: 100,
    description: 'Goods and Services Tax registration.',
    requiredDocumentIds: ['doc-pan', 'doc-company'],
    dependencies: [],
    canParallelWith: ['appr-001', 'appr-002'],
    slaWorkingDays: 3,
    category: 'Tax',
  },
];

// ── DOCUMENTS ──
export const documents: Document[] = [
  {
    id: 'doc-pan',
    name: 'PAN Card',
    type: 'Identity',
    status: 'verified',
    uploadedDate: '2026-09-10',
    verifiedDate: '2026-09-12',
    fileSize: '245 KB',
    reusableIn: ['appr-001', 'appr-002', 'appr-003', 'appr-004', 'appr-005', 'appr-006', 'appr-007', 'appr-008', 'appr-009', 'appr-010', 'appr-011', 'appr-012'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-gst',
    name: 'GST Certificate',
    type: 'Tax',
    status: 'verified',
    uploadedDate: '2026-09-10',
    verifiedDate: '2026-09-12',
    fileSize: '312 KB',
    reusableIn: ['appr-001', 'appr-003', 'appr-004', 'appr-009', 'appr-010', 'appr-011'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-company',
    name: 'Company Registration (CIN)',
    type: 'Registration',
    status: 'verified',
    uploadedDate: '2026-09-08',
    verifiedDate: '2026-09-11',
    fileSize: '1.2 MB',
    reusableIn: ['appr-003', 'appr-004', 'appr-005', 'appr-006', 'appr-009', 'appr-010', 'appr-012'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-land',
    name: 'Land Document / Allotment Letter',
    type: 'Property',
    status: 'verified',
    uploadedDate: '2026-09-09',
    verifiedDate: '2026-09-13',
    fileSize: '3.4 MB',
    reusableIn: ['appr-001', 'appr-002', 'appr-003', 'appr-005', 'appr-006', 'appr-007', 'appr-011'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-project',
    name: 'Detailed Project Report',
    type: 'Project',
    status: 'verified',
    uploadedDate: '2026-09-12',
    verifiedDate: '2026-09-15',
    fileSize: '8.7 MB',
    reusableIn: ['appr-001', 'appr-004', 'appr-010'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-layout',
    name: 'Factory Layout Plan',
    type: 'Engineering',
    status: 'verified',
    uploadedDate: '2026-09-14',
    verifiedDate: '2026-09-16',
    fileSize: '5.1 MB',
    reusableIn: ['appr-002', 'appr-003', 'appr-004'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-machinery',
    name: 'Machinery Details & Specifications',
    type: 'Technical',
    status: 'missing',
    reusableIn: ['appr-001'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-water',
    name: 'Water Consumption Declaration',
    type: 'Environmental',
    status: 'missing',
    reusableIn: ['appr-001', 'appr-007'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-fire-plan',
    name: 'Fire Safety Plan',
    type: 'Safety',
    status: 'uploaded',
    uploadedDate: '2026-09-20',
    fileSize: '2.3 MB',
    reusableIn: ['appr-002'],
    businessId: 'biz-001',
  },
  {
    id: 'doc-env',
    name: 'Environmental Impact Assessment',
    type: 'Environmental',
    status: 'uploaded',
    uploadedDate: '2026-09-18',
    fileSize: '6.8 MB',
    reusableIn: ['appr-001'],
    businessId: 'biz-001',
  },
];

// ── APPLICATIONS ──
export const applications: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'MH-PC-2026-01842',
    businessId: 'biz-001',
    approvalId: 'appr-001',
    departmentId: 'dept-env',
    status: 'query_raised',
    submittedDate: '2026-09-18',
    lastUpdated: '2026-09-24',
    expectedSlaDate: '2026-10-08',
    daysElapsed: 7,
    progress: 65,
    documentIds: ['doc-pan', 'doc-gst', 'doc-land', 'doc-project'],
    inspectionId: 'insp-001',
    timeline: [
      { date: '2026-09-18', title: 'Application Submitted', description: 'Application submitted with 4 verified documents', status: 'completed' },
      { date: '2026-09-19', title: 'Documents Validated', description: 'All submitted documents passed validation', status: 'completed' },
      { date: '2026-09-21', title: 'Technical Scrutiny', description: 'Application assigned for technical review', status: 'completed' },
      { date: '2026-09-24', title: 'Department Query Raised', description: 'MPCB raised query regarding machinery details and water consumption data', status: 'current' },
      { date: '2026-09-28', title: 'Inspection Scheduled', description: 'Site inspection scheduled', status: 'upcoming' },
    ],
    queryDetails: {
      query: 'Please provide machinery specifications and water consumption declaration for food processing unit.',
      raisedDate: '2026-09-24',
      responseDeadline: '2026-09-27',
      department: 'Maharashtra Pollution Control Board',
    },
    riskLevel: 'medium',
    riskIndicators: [
      { label: 'Identity verified', status: 'pass', detail: 'PAN and business identity verified' },
      { label: 'Business details consistent', status: 'pass', detail: 'All business information matches across documents' },
      { label: 'Required documents present', status: 'pass', detail: '4 of 6 required documents submitted' },
      { label: 'Machinery details recently modified', status: 'warning', detail: 'Document updated on 2026-09-22' },
    ],
  },
  {
    id: 'app-002',
    applicationNumber: 'MH-FS-2026-00934',
    businessId: 'biz-001',
    approvalId: 'appr-002',
    departmentId: 'dept-fire',
    status: 'under_review',
    submittedDate: '2026-09-15',
    lastUpdated: '2026-09-22',
    expectedSlaDate: '2026-09-29',
    daysElapsed: 10,
    progress: 40,
    documentIds: ['doc-pan', 'doc-land', 'doc-layout', 'doc-fire-plan'],
    timeline: [
      { date: '2026-09-15', title: 'Application Submitted', description: 'Fire NOC application submitted', status: 'completed' },
      { date: '2026-09-16', title: 'Documents Validated', description: 'All documents validated', status: 'completed' },
      { date: '2026-09-22', title: 'Under Technical Review', description: 'Fire safety plan under review by technical officer', status: 'current' },
      { date: '2026-09-30', title: 'Inspection Scheduled', description: 'Fire safety site inspection', status: 'upcoming' },
    ],
    riskLevel: 'low',
    riskIndicators: [
      { label: 'Identity verified', status: 'pass', detail: 'PAN verified' },
      { label: 'Business details consistent', status: 'pass', detail: 'All details match' },
      { label: 'Required documents present', status: 'pass', detail: 'All required documents submitted' },
      { label: 'Fire safety plan complete', status: 'pass', detail: 'Plan reviewed and complete' },
    ],
  },
  {
    id: 'app-003',
    applicationNumber: 'MH-FSSAI-2026-02187',
    businessId: 'biz-001',
    approvalId: 'appr-004',
    departmentId: 'dept-fssai',
    status: 'under_review',
    submittedDate: '2026-09-10',
    lastUpdated: '2026-09-20',
    expectedSlaDate: '2026-10-20',
    daysElapsed: 15,
    progress: 55,
    documentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project', 'doc-layout'],
    timeline: [
      { date: '2026-09-10', title: 'Application Submitted', description: 'FSSAI licence application submitted', status: 'completed' },
      { date: '2026-09-12', title: 'Documents Validated', description: 'Documents validated', status: 'completed' },
      { date: '2026-09-15', title: 'Assigned to Officer', description: 'Application assigned to designated officer', status: 'completed' },
      { date: '2026-09-20', title: 'Under Review', description: 'Application under detailed scrutiny', status: 'current' },
      { date: '2026-10-05', title: 'Inspection (Expected)', description: 'Food safety site inspection', status: 'upcoming' },
    ],
    riskLevel: 'low',
    riskIndicators: [
      { label: 'Identity verified', status: 'pass', detail: 'PAN verified' },
      { label: 'Business details consistent', status: 'pass', detail: 'All details match' },
      { label: 'Required documents present', status: 'pass', detail: 'All required documents submitted' },
      { label: 'Food processing category verified', status: 'pass', detail: 'Category matches business profile' },
    ],
  },
  {
    id: 'app-004',
    applicationNumber: 'MH-WC-2026-00567',
    businessId: 'biz-001',
    approvalId: 'appr-007',
    departmentId: 'dept-water',
    status: 'submitted',
    submittedDate: '2026-09-22',
    lastUpdated: '2026-09-23',
    expectedSlaDate: '2026-10-13',
    daysElapsed: 3,
    progress: 30,
    documentIds: ['doc-pan', 'doc-land'],
    timeline: [
      { date: '2026-09-22', title: 'Application Submitted', description: 'Water connection application submitted', status: 'completed' },
      { date: '2026-09-23', title: 'Under Verification', description: 'Application under initial verification', status: 'current' },
    ],
    riskLevel: 'low',
    riskIndicators: [
      { label: 'Identity verified', status: 'pass', detail: 'PAN verified' },
      { label: 'Land document verified', status: 'pass', detail: 'MIDC allotment confirmed' },
    ],
  },
  {
    id: 'app-005',
    applicationNumber: 'MH-TL-2026-03421',
    businessId: 'biz-001',
    approvalId: 'appr-011',
    departmentId: 'dept-panchayat',
    status: 'approved',
    submittedDate: '2026-09-05',
    lastUpdated: '2026-09-12',
    expectedSlaDate: '2026-09-15',
    daysElapsed: 7,
    progress: 100,
    documentIds: ['doc-pan', 'doc-gst', 'doc-land'],
    timeline: [
      { date: '2026-09-05', title: 'Application Submitted', description: 'Trade licence application submitted', status: 'completed' },
      { date: '2026-09-06', title: 'Documents Verified', description: 'Documents verified', status: 'completed' },
      { date: '2026-09-10', title: 'Approved', description: 'Trade licence approved and issued', status: 'completed' },
    ],
    riskLevel: 'low',
    riskIndicators: [
      { label: 'Identity verified', status: 'pass', detail: 'PAN verified' },
      { label: 'Business details consistent', status: 'pass', detail: 'All details match' },
      { label: 'Required documents present', status: 'pass', detail: 'All required documents submitted' },
    ],
  },
];

// ── INSPECTIONS ──
export const inspections: Inspection[] = [
  {
    id: 'insp-001',
    businessId: 'biz-001',
    applicationId: 'app-001',
    departmentId: 'dept-env',
    type: 'Environmental Compliance Inspection',
    scheduledDate: '2026-09-30',
    scheduledTime: '10:30 AM',
    status: 'scheduled',
    inspectorName: 'Dr. R. S. Patil',
    location: 'Nashik MIDC, Plot No. 42',
    clusterOpportunity: true,
  },
  {
    id: 'insp-002',
    businessId: 'biz-001',
    applicationId: 'app-002',
    departmentId: 'dept-fire',
    type: 'Fire Safety Inspection',
    scheduledDate: '2026-09-30',
    scheduledTime: '11:30 AM',
    status: 'scheduled',
    inspectorName: 'Shri. A. K. Deshmukh',
    location: 'Nashik MIDC, Plot No. 42',
    clusterOpportunity: true,
  },
  {
    id: 'insp-003',
    businessId: 'biz-001',
    applicationId: 'app-003',
    departmentId: 'dept-fssai',
    type: 'Food Safety Inspection',
    scheduledDate: '2026-10-05',
    scheduledTime: '10:00 AM',
    status: 'scheduled',
    location: 'Nashik MIDC, Plot No. 42',
    clusterOpportunity: true,
  },
];

// ── COMPLIANCE ITEMS ──
export const complianceItems: ComplianceItem[] = [
  { id: 'comp-001', name: 'Pollution Consent (CTO)', category: 'environmental', status: 'due_soon', dueDate: '2026-10-13', businessId: 'biz-001', renewalPeriodMonths: 60 },
  { id: 'comp-002', name: 'Factory Licence', category: 'licences', status: 'due_soon', dueDate: '2026-10-13', lastCompletedDate: '2025-10-13', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-003', name: 'Fire Safety NOC', category: 'safety', status: 'due_soon', dueDate: '2026-11-28', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-004', name: 'FSSAI Licence', category: 'licences', status: 'compliant', dueDate: '2027-09-10', lastCompletedDate: '2026-09-10', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-005', name: 'Labour Welfare Fund', category: 'labour', status: 'compliant', dueDate: '2027-01-15', lastCompletedDate: '2026-07-15', businessId: 'biz-001', renewalPeriodMonths: 6 },
  { id: 'comp-006', name: 'Hazardous Waste Report', category: 'environmental', status: 'compliant', dueDate: '2027-03-31', lastCompletedDate: '2026-03-31', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-007', name: 'Shop & Establishment', category: 'licences', status: 'compliant', dueDate: '2027-04-01', lastCompletedDate: '2026-04-01', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-008', name: 'Boiler Inspection Certificate', category: 'safety', status: 'not_applicable', dueDate: '', businessId: 'biz-001' },
  { id: 'comp-009', name: 'Trade Licence Renewal', category: 'renewals', status: 'compliant', dueDate: '2027-09-05', lastCompletedDate: '2026-09-05', businessId: 'biz-001', renewalPeriodMonths: 12 },
  { id: 'comp-010', name: 'EPF Registration', category: 'labour', status: 'compliant', dueDate: '2027-03-31', businessId: 'biz-001' },
  { id: 'comp-011', name: 'ESI Registration', category: 'labour', status: 'compliant', dueDate: '2027-03-31', businessId: 'biz-001' },
];

// ── SCHEMES ──
export const schemes: Scheme[] = [
  {
    id: 'scheme-001',
    name: 'Package Scheme of Incentives (PSI) 2024',
    description: 'Maharashtra state incentive scheme for new industrial investments including capital subsidy, interest subsidy, and stamp duty exemption.',
    matchPercentage: 91,
    matchReasons: ['Maharashtra location', 'Manufacturing unit', 'Investment in eligible range (₹1-10 Cr)', 'Food processing — priority sector'],
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project', 'doc-land'],
    availableDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-land'],
    missingDocumentIds: ['doc-project'],
    category: 'State Incentive',
    maxBenefit: 'Up to 40% of fixed capital investment',
    eligibilityNote: 'Final eligibility subject to official scheme rules and Directorate of Industries verification.',
  },
  {
    id: 'scheme-002',
    name: 'PMFME — PM Formalisation of Micro Food Processing',
    description: 'Central government scheme providing credit-linked capital subsidy for food processing micro-enterprises.',
    matchPercentage: 85,
    matchReasons: ['Food processing sector', 'MSME registered', 'Manufacturing expansion', 'Maharashtra coverage'],
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project'],
    availableDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-project'],
    missingDocumentIds: [],
    category: 'Central Scheme',
    maxBenefit: '35% capital subsidy (max ₹10 Lakh)',
    eligibilityNote: 'Final eligibility subject to PMFME scheme guidelines and district-level nodal agency review.',
  },
  {
    id: 'scheme-003',
    name: 'CLCSS — Credit Linked Capital Subsidy Scheme',
    description: 'MSME Ministry scheme for technology upgradation in manufacturing with 15% capital subsidy.',
    matchPercentage: 78,
    matchReasons: ['MSME registered', 'Manufacturing unit', 'Technology upgradation applicable'],
    requiredDocumentIds: ['doc-pan', 'doc-gst', 'doc-company', 'doc-machinery'],
    availableDocumentIds: ['doc-pan', 'doc-gst', 'doc-company'],
    missingDocumentIds: ['doc-machinery'],
    category: 'Central Scheme',
    maxBenefit: '15% capital subsidy on plant & machinery',
    eligibilityNote: 'Final eligibility subject to MSME-DI verification and scheme-specific rules.',
  },
];

// ── ALERTS ──
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    title: 'Department query requires response',
    description: 'MPCB has raised a query on your Pollution Consent application. Machinery specifications and water consumption declaration are required. Response deadline: 27 Sep 2026.',
    severity: 'critical',
    date: '2026-09-24',
    read: false,
    actionUrl: '/applications/app-001',
    businessId: 'biz-001',
    relatedEntityType: 'application',
    relatedEntityId: 'app-001',
  },
  {
    id: 'alert-002',
    title: 'Factory Licence renewal in 18 days',
    description: 'Your Factory Licence (DISH) is due for renewal on 13 October 2026. Ensure all documents are updated before the renewal date.',
    severity: 'warning',
    date: '2026-09-25',
    read: false,
    actionUrl: '/compliance',
    businessId: 'biz-001',
    relatedEntityType: 'compliance',
    relatedEntityId: 'comp-002',
  },
  {
    id: 'alert-003',
    title: 'Inspection scheduled for 30 September',
    description: 'Fire Safety Inspection has been scheduled for 30 September 2026 at 11:30 AM at your Nashik MIDC facility.',
    severity: 'info',
    date: '2026-09-23',
    read: false,
    actionUrl: '/inspections',
    businessId: 'biz-001',
    relatedEntityType: 'inspection',
    relatedEntityId: 'insp-002',
  },
  {
    id: 'alert-004',
    title: 'Application moved to technical scrutiny',
    description: 'Your FSSAI licence application (MH-FSSAI-2026-02187) has been moved to technical scrutiny stage.',
    severity: 'success',
    date: '2026-09-20',
    read: true,
    actionUrl: '/applications/app-003',
    businessId: 'biz-001',
    relatedEntityType: 'application',
    relatedEntityId: 'app-003',
  },
  {
    id: 'alert-005',
    title: 'Pollution Consent SLA nearing limit',
    description: 'Your Pollution Consent application has been under review for 7 of 15 working days. SLA compliance at 47%.',
    severity: 'warning',
    date: '2026-09-25',
    read: false,
    businessId: 'biz-001',
    relatedEntityType: 'application',
    relatedEntityId: 'app-001',
  },
  {
    id: 'alert-006',
    title: 'Water connection application submitted',
    description: 'Your water connection application has been successfully submitted and is under initial verification.',
    severity: 'success',
    date: '2026-09-22',
    read: true,
    actionUrl: '/applications/app-004',
    businessId: 'biz-001',
    relatedEntityType: 'application',
    relatedEntityId: 'app-004',
  },
  {
    id: 'alert-007',
    title: 'Scheme match identified',
    description: 'Based on your business profile, you may be eligible for Package Scheme of Incentives (PSI) 2024 with 91% match.',
    severity: 'info',
    date: '2026-09-20',
    read: true,
    actionUrl: '/schemes',
    businessId: 'biz-001',
  },
];

// ── GRIEVANCES ──
export const grievances: Grievance[] = [
  {
    id: 'grv-001',
    applicationNumber: 'MH-PC-2026-01842',
    businessId: 'biz-001',
    issue: 'Application delayed beyond expected timeline',
    currentStage: 'Inspection scheduling',
    slaDays: 15,
    elapsedDays: 17,
    status: 'open',
    escalationLevel: 0,
    timeline: [
      { date: '2026-09-25', title: 'Grievance Logged', description: 'SLA breach detected by system', status: 'current' },
    ],
  },
];

// ── OFFICER DASHBOARD STATS ──
export const officerStats: OfficerDashboardStats = {
  totalApplications: 428,
  pending: 91,
  slaAtRisk: 23,
  slaBreached: 12,
  pipeline: {
    received: 47,
    verification: 83,
    scrutiny: 112,
    inspection: 91,
    decision: 95,
  },
};

// ── BOTTLENECK DATA ──
export const bottleneckData: BottleneckData[] = [
  { process: 'Inspection Scheduling', pending: 37, avgDelay: 4.2 },
  { process: 'Document Verification', pending: 21, avgDelay: 2.1 },
  { process: 'Technical Scrutiny', pending: 18, avgDelay: 3.7 },
  { process: 'Inter-department Coordination', pending: 14, avgDelay: 5.1 },
  { process: 'Query Response Wait', pending: 12, avgDelay: 3.3 },
  { process: 'Final Decision', pending: 8, avgDelay: 1.8 },
];

// ── OFFICER APPLICATIONS (for government dashboard) ──
export interface OfficerApplication {
  id: string;
  applicationNumber: string;
  businessName: string;
  approvalType: string;
  status: string;
  submittedDate: string;
  daysElapsed: number;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  riskLevel: string;
  district: string;
}

export const officerApplications: OfficerApplication[] = [
  { id: 'oapp-001', applicationNumber: 'MH-PC-2026-01842', businessName: 'Aarambh Foods Pvt. Ltd.', approvalType: 'Pollution Consent', status: 'Query Raised', submittedDate: '2026-09-18', daysElapsed: 7, slaStatus: 'on_track', riskLevel: 'Medium', district: 'Nashik' },
  { id: 'oapp-002', applicationNumber: 'MH-PC-2026-01756', businessName: 'GreenTech Chemicals', approvalType: 'Pollution Consent', status: 'Under Review', submittedDate: '2026-09-05', daysElapsed: 20, slaStatus: 'breached', riskLevel: 'High', district: 'Pune' },
  { id: 'oapp-003', applicationNumber: 'MH-FR-2026-00891', businessName: 'Sahyadri Textiles', approvalType: 'Factory Registration', status: 'Inspection Pending', submittedDate: '2026-09-10', daysElapsed: 15, slaStatus: 'at_risk', riskLevel: 'Low', district: 'Nagpur' },
  { id: 'oapp-004', applicationNumber: 'MH-FS-2026-01234', businessName: 'Vasundhara Agro Pvt. Ltd.', approvalType: 'Fire Safety NOC', status: 'Under Review', submittedDate: '2026-09-12', daysElapsed: 13, slaStatus: 'at_risk', riskLevel: 'Low', district: 'Nashik' },
  { id: 'oapp-005', applicationNumber: 'MH-PC-2026-01901', businessName: 'Bharat Pharma Ltd.', approvalType: 'Pollution Consent', status: 'Technical Scrutiny', submittedDate: '2026-09-15', daysElapsed: 10, slaStatus: 'on_track', riskLevel: 'Medium', district: 'Aurangabad' },
  { id: 'oapp-006', applicationNumber: 'MH-FSSAI-2026-02100', businessName: 'Nashik Dairy Products', approvalType: 'FSSAI Licence', status: 'Under Review', submittedDate: '2026-09-08', daysElapsed: 17, slaStatus: 'on_track', riskLevel: 'Low', district: 'Nashik' },
  { id: 'oapp-007', applicationNumber: 'MH-FR-2026-00945', businessName: 'AutoParts India Pvt. Ltd.', approvalType: 'Factory Registration', status: 'Submitted', submittedDate: '2026-09-20', daysElapsed: 5, slaStatus: 'on_track', riskLevel: 'Low', district: 'Pune' },
];

// ── OFFICER INSPECTIONS ──
export interface OfficerInspection {
  id: string;
  businessName: string;
  type: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedInspector: string;
  status: string;
  cluster?: string;
}

export const officerInspections: OfficerInspection[] = [
  { id: 'oinsp-001', businessName: 'Aarambh Foods Pvt. Ltd.', type: 'Environmental', location: 'Nashik MIDC, Plot 42', scheduledDate: '2026-09-30', scheduledTime: '10:30 AM', assignedInspector: 'Dr. R. S. Patil', status: 'Scheduled', cluster: 'Nashik Industrial Cluster' },
  { id: 'oinsp-002', businessName: 'Vasundhara Agro Pvt. Ltd.', type: 'Fire Safety', location: 'Nashik MIDC, Plot 67', scheduledDate: '2026-09-30', scheduledTime: '02:00 PM', assignedInspector: 'Shri. A. K. Deshmukh', status: 'Scheduled', cluster: 'Nashik Industrial Cluster' },
  { id: 'oinsp-003', businessName: 'Nashik Dairy Products', type: 'Food Safety', location: 'Nashik MIDC, Plot 31', scheduledDate: '2026-09-30', scheduledTime: '04:00 PM', assignedInspector: '', status: 'Pending Assignment', cluster: 'Nashik Industrial Cluster' },
  { id: 'oinsp-004', businessName: 'GreenTech Chemicals', type: 'Environmental', location: 'Chakan MIDC, Plot 112', scheduledDate: '2026-10-02', scheduledTime: '10:00 AM', assignedInspector: 'Dr. S. M. Joshi', status: 'Scheduled' },
  { id: 'oinsp-005', businessName: 'Sahyadri Textiles', type: 'Factory', location: 'Butibori MIDC, Plot 88', scheduledDate: '2026-10-04', scheduledTime: '11:00 AM', assignedInspector: '', status: 'Pending Assignment' },
];

// ── MONTHLY PIPELINE DATA (for charts) ──
export const monthlyPipelineData = [
  { month: 'Apr', received: 32, approved: 28, rejected: 2 },
  { month: 'May', received: 41, approved: 35, rejected: 3 },
  { month: 'Jun', received: 38, approved: 31, rejected: 4 },
  { month: 'Jul', received: 45, approved: 38, rejected: 2 },
  { month: 'Aug', received: 52, approved: 42, rejected: 5 },
  { month: 'Sep', received: 47, approved: 29, rejected: 3 },
];

// ── DEPARTMENT-WISE STATS ──
export const departmentStats = [
  { name: 'MPCB', total: 134, pending: 28, avgDays: 11.2 },
  { name: 'Fire', total: 89, pending: 18, avgDays: 7.5 },
  { name: 'DISH', total: 72, pending: 15, avgDays: 14.8 },
  { name: 'FSSAI', total: 65, pending: 12, avgDays: 18.3 },
  { name: 'MIDC', total: 43, pending: 8, avgDays: 22.1 },
  { name: 'MSEB', total: 25, pending: 10, avgDays: 9.7 },
];

// ── HELPER: get department by id ──
export function getDepartment(id: string): Department | undefined {
  return departments.find(d => d.id === id);
}

export function getApproval(id: string): Approval | undefined {
  return approvals.find(a => a.id === id);
}

export function getDocument(id: string): Document | undefined {
  return documents.find(d => d.id === id);
}

export function getApplication(id: string): Application | undefined {
  return applications.find(a => a.id === id);
}

export function getApplicationByApprovalId(approvalId: string): Application | undefined {
  return applications.find(a => a.approvalId === approvalId);
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Crore`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysUntil(dateStr: string): number {
  const today = new Date('2026-09-25');
  const target = new Date(dateStr);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
