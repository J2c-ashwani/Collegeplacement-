/**
 * PlacementConnect — Brand System, 9-Dimension Assessment Rubric & 4-Level Reporting Model (v4.1)
 * Combines human-first executive clarity on the public layer with discoverable technical precision inside product previews.
 */

export const SAFE_TERMINOLOGY = {
  assessmentFrameworkName: '9-Dimension Student Readiness Assessment',
  assessmentShortName: '9-Dimension Readiness Assessment',
  institutionalGovernanceName: 'Institutional Placement & Corporate Hiring Platform',
  productPreviewLabel: 'Interactive Product Preview — TPO Placement Workspace',
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
    sampleScore: 82,
    samplePercentile: 'Weighted: 12.30 / 15.00 pts',
    evaluationMethod: 'Workplace scenario comprehension and structured articulation',
  },
  {
    id: 'dim-2',
    code: 'Dimension 02',
    name: 'Analytical Problem Solving & Quantitative Logic',
    category: 'Analytical & Technical',
    weightPercent: 15,
    sampleScore: 86,
    samplePercentile: 'Weighted: 12.90 / 15.00 pts',
    evaluationMethod: 'Multi-constraint data interpretation and logical reasoning cases',
  },
  {
    id: 'dim-3',
    code: 'Dimension 03',
    name: 'Learning Agility & Concept Application',
    category: 'Analytical & Technical',
    weightPercent: 12,
    sampleScore: 80,
    samplePercentile: 'Weighted: 9.60 / 12.00 pts',
    evaluationMethod: 'Adapting to unfamiliar rules and applying new frameworks rapidly',
  },
  {
    id: 'dim-4',
    code: 'Dimension 04',
    name: 'Work Ownership, Ethics & Reliability',
    category: 'Professional Execution',
    weightPercent: 10,
    sampleScore: 85,
    samplePercentile: 'Weighted: 8.50 / 10.00 pts',
    evaluationMethod: 'Situational judgment under delivery pressure and accountability standards',
  },
  {
    id: 'dim-5',
    code: 'Dimension 05',
    name: 'Role-Aligned Technical & Domain Foundations',
    category: 'Analytical & Technical',
    weightPercent: 15,
    sampleScore: 78,
    samplePercentile: 'Weighted: 11.70 / 15.00 pts',
    evaluationMethod: 'Core engineering, software, or business fundamentals by degree track',
  },
  {
    id: 'dim-6',
    code: 'Dimension 06',
    name: 'Teamwork & Cross-Functional Collaboration',
    category: 'Communication & Collaboration',
    weightPercent: 10,
    sampleScore: 80,
    samplePercentile: 'Weighted: 8.00 / 10.00 pts',
    evaluationMethod: 'Constructive disagreement, peer coordination, and stakeholder alignment',
  },
  {
    id: 'dim-7',
    code: 'Dimension 07',
    name: 'Professional Conduct & Workplace Readiness',
    category: 'Communication & Collaboration',
    weightPercent: 8,
    sampleScore: 84,
    samplePercentile: 'Weighted: 6.72 / 8.00 pts',
    evaluationMethod: 'Client communication standards, escalation discipline, and etiquette',
  },
  {
    id: 'dim-8',
    code: 'Dimension 08',
    name: 'Career Direction & Role Commitment',
    category: 'Professional Execution',
    weightPercent: 8,
    sampleScore: 80,
    samplePercentile: 'Weighted: 6.40 / 8.00 pts',
    evaluationMethod: 'Role expectation alignment and long-term retention indicators',
  },
  {
    id: 'dim-9',
    code: 'Dimension 09',
    name: 'Operational & Joining Readiness',
    category: 'Professional Execution',
    weightPercent: 7,
    sampleScore: 84,
    samplePercentile: 'Weighted: 5.88 / 7.00 pts',
    evaluationMethod: 'Location flexibility, work-mode readiness, and joining timeline verification',
  },
];

export const FOUR_DENOMINATOR_MODEL = [
  {
    id: 'D1',
    code: '1. Graduating Batch',
    label: 'Full Graduating Batch',
    sampleCount: 600,
    percentOfBatch: '100%',
    samplePlacedCount: 384,
    samplePlacementRate: '64.0%',
    formulaText: '384 placed ÷ 600 batch = 64.0%',
    description: 'All 600 final-year students uploaded in the official college batch roster (100% of graduating batch).',
  },
  {
    id: 'D2',
    code: '2. Seeking Placement',
    label: 'Opted for Campus Placement',
    sampleCount: 510,
    percentOfBatch: '85.0%',
    samplePlacedCount: 384,
    samplePlacementRate: '75.3%',
    formulaText: '384 placed ÷ 510 seeking = 75.3%',
    description: '510 students (85.0% of batch) actively seeking placement after excluding higher-studies and family-business opt-outs.',
  },
  {
    id: 'D3',
    code: '3. Enrolled in Programme',
    label: 'Enrolled in 3-Interview Assurance',
    sampleCount: 440,
    percentOfBatch: '73.3%',
    samplePlacedCount: 384,
    samplePlacementRate: '87.3%',
    formulaText: '384 placed ÷ 440 enrolled = 87.3%',
    description: '440 students (73.3% of batch) enrolled in the 3 Corporate Interview Assurance track.',
  },
  {
    id: 'D4',
    code: '4. Assessed & Eligible',
    label: 'Assessed & Interview-Ready Pool',
    sampleCount: 412,
    percentOfBatch: '68.7%',
    samplePlacedCount: 384,
    samplePlacementRate: '93.2%',
    formulaText: '384 placed ÷ 412 eligible = 93.2%',
    description: '412 students (68.7% of batch) who completed the 9-area readiness evaluation and met attendance rules.',
  },
] as const;
