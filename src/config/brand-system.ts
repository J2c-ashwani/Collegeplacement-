/**
 * PlacementConnect — Brand System, 9-Dimension Assessment Rubric & 4-Level Reporting Model (v4.1)
 * Combines human-first executive clarity on the public layer with discoverable technical precision inside product previews.
 */

export const SAFE_TERMINOLOGY = {
  assessmentFrameworkName: '9-Dimension Employability Assessment Framework',
  assessmentShortName: '9-Dimension Employability Evaluation',
  institutionalGovernanceName: 'Placement Evidence & Institutional Reporting Framework',
  productPreviewLabel: 'Interactive Product Preview — Illustrative Campus Workspace',
} as const;

export interface EmployabilityDimensionSpec {
  id: string;
  code: string;
  name: string;
  category: 'Analytical & Technical' | 'Communication & Collaboration' | 'Professional Execution';
  weightPercent: number;
  sampleScore: number;
  samplePercentile: string;
  evaluationMethod: string;
}

export const NINE_DIMENSIONS_SPEC: EmployabilityDimensionSpec[] = [
  {
    id: 'dim-1',
    code: 'Dimension 01',
    name: 'Communication Clarity & Written Precision',
    category: 'Communication & Collaboration',
    weightPercent: 15,
    sampleScore: 84,
    samplePercentile: 'Top 12%',
    evaluationMethod: 'Workplace scenario comprehension and structured articulation',
  },
  {
    id: 'dim-2',
    code: 'Dimension 02',
    name: 'Analytical Problem Solving & Quantitative Logic',
    category: 'Analytical & Technical',
    weightPercent: 15,
    sampleScore: 88,
    samplePercentile: 'Top 8%',
    evaluationMethod: 'Multi-constraint data interpretation and logical reasoning cases',
  },
  {
    id: 'dim-3',
    code: 'Dimension 03',
    name: 'Learning Agility & Concept Application',
    category: 'Analytical & Technical',
    weightPercent: 12,
    sampleScore: 81,
    samplePercentile: 'Top 16%',
    evaluationMethod: 'Adapting to unfamiliar rules and applying new frameworks rapidly',
  },
  {
    id: 'dim-4',
    code: 'Dimension 04',
    name: 'Work Ownership, Ethics & Reliability',
    category: 'Professional Execution',
    weightPercent: 10,
    sampleScore: 91,
    samplePercentile: 'Top 5%',
    evaluationMethod: 'Situational judgment under delivery pressure and accountability standards',
  },
  {
    id: 'dim-5',
    code: 'Dimension 05',
    name: 'Role-Aligned Technical & Domain Foundations',
    category: 'Analytical & Technical',
    weightPercent: 15,
    sampleScore: 79,
    samplePercentile: 'Top 19%',
    evaluationMethod: 'Core engineering, software, or business fundamentals by degree track',
  },
  {
    id: 'dim-6',
    code: 'Dimension 06',
    name: 'Teamwork & Cross-Functional Collaboration',
    category: 'Communication & Collaboration',
    weightPercent: 10,
    sampleScore: 85,
    samplePercentile: 'Top 11%',
    evaluationMethod: 'Constructive disagreement, peer coordination, and stakeholder alignment',
  },
  {
    id: 'dim-7',
    code: 'Dimension 07',
    name: 'Professional Conduct & Workplace Readiness',
    category: 'Communication & Collaboration',
    weightPercent: 8,
    sampleScore: 87,
    samplePercentile: 'Top 9%',
    evaluationMethod: 'Client communication standards, escalation discipline, and etiquette',
  },
  {
    id: 'dim-8',
    code: 'Dimension 08',
    name: 'Career Direction & Role Commitment',
    category: 'Professional Execution',
    weightPercent: 8,
    sampleScore: 83,
    samplePercentile: 'Top 14%',
    evaluationMethod: 'Role expectation alignment and long-term retention indicators',
  },
  {
    id: 'dim-9',
    code: 'Dimension 09',
    name: 'Operational & Joining Readiness',
    category: 'Professional Execution',
    weightPercent: 7,
    sampleScore: 86,
    samplePercentile: 'Top 10%',
    evaluationMethod: 'Location flexibility, work-mode readiness, and joining timeline verification',
  },
];

export const FOUR_DENOMINATOR_MODEL = [
  {
    id: 'D1',
    code: 'Full Graduating Batch',
    label: 'Total Sanctioned Cohort',
    sampleCount: 600,
    samplePlacementRate: '64.0%',
    description: 'All 600 final-year students uploaded in the official institutional batch roster.',
  },
  {
    id: 'D2',
    code: 'Opted for Placement',
    label: 'Registered Placement Candidates',
    sampleCount: 510,
    samplePlacementRate: '75.3%',
    description: 'Students actively seeking campus placement (excluding higher-studies opt-outs).',
  },
  {
    id: 'D3',
    code: 'Programme Cohort',
    label: 'Enrolled in Interview Assurance',
    sampleCount: 440,
    samplePlacementRate: '87.2%',
    description: 'Students participating in the 3-Interview Assurance track.',
  },
  {
    id: 'D4',
    code: 'Assessed & Eligible',
    label: 'Verified Interview-Ready Pool',
    sampleCount: 412,
    samplePlacementRate: '93.2%',
    description: 'Students who completed the 9-Dimension Evaluation and met attendance criteria.',
  },
] as const;
