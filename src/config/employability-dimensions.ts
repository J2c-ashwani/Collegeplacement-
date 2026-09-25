/**
 * Canonical 9-Dimension Employability Diagnostic Schema & Weighted Scoring Engine
 * Methodology Version: v3.2
 *
 * Used as the single source of truth across:
 *   Database -> API -> Business Logic -> Student Scorecard -> TPO Student Detail -> Recruiter Dashboard -> PDF Exports
 */

export const EMPLOYABILITY_SCORE_METHODOLOGY_VERSION = 'v3.2';

export interface EmployabilityDimensionDefinition {
  index: number;
  key:
    | 'technical_readiness'
    | 'problem_solving'
    | 'situational_communication'
    | 'work_ethics'
    | 'domain_role_application'
    | 'learning_agility'
    | 'team_collaboration'
    | 'professionalism'
    | 'interview_poise';
  label: string;
  shortLabel: string;
  weightPercent: number;
  description: string;
  defaultAaravScore: number;
}

/**
 * Exact 9 Canonical Dimensions
 * Weights sum to exactly 100% (20 + 15 + 10 + 10 + 10 + 10 + 10 + 5 + 10 = 100%).
 * For Aarav Sharma (APX2026CS042):
 *   82*0.20 (16.40) + 80*0.15 (12.00) + 85*0.10 (8.50) + 90*0.10 (9.00) +
 *   84*0.10 (8.40)  + 88*0.10 (8.80)  + 84*0.10 (8.40) + 86*0.05 (4.30) +
 *   82*0.10 (8.20)  = 84.00 / 100.0
 */
export const CANONICAL_9_EMPLOYABILITY_DIMENSIONS: EmployabilityDimensionDefinition[] = [
  {
    index: 1,
    key: 'technical_readiness',
    label: 'Technical Readiness',
    shortLabel: 'Tech',
    weightPercent: 20,
    description: 'Foundational programming, data structures, systems architecture, and debugging proficiency',
    defaultAaravScore: 82,
  },
  {
    index: 2,
    key: 'problem_solving',
    label: 'Problem Solving & Logic',
    shortLabel: 'Logic',
    weightPercent: 15,
    description: 'Algorithmic decomposition, quantitative reasoning, and structured root-cause analysis',
    defaultAaravScore: 80,
  },
  {
    index: 3,
    key: 'situational_communication',
    label: 'Situational Communication',
    shortLabel: 'Comm',
    weightPercent: 10,
    description: 'Articulation clarity, stakeholder correspondence, and structured technical explanation',
    defaultAaravScore: 85,
  },
  {
    index: 4,
    key: 'work_ethics',
    label: 'Work Ethics & Integrity',
    shortLabel: 'Ethics',
    weightPercent: 10,
    description: 'Accountability, ownership, compliance discipline, and workplace reliability',
    defaultAaravScore: 90,
  },
  {
    index: 5,
    key: 'domain_role_application',
    label: 'Domain & Role Application',
    shortLabel: 'Domain',
    weightPercent: 10,
    description: 'Practical application of engineering specialization to production systems & role requirements',
    defaultAaravScore: 84,
  },
  {
    index: 6,
    key: 'learning_agility',
    label: 'Learning Agility',
    shortLabel: 'Agility',
    weightPercent: 10,
    description: 'Speed of mastering unfamiliar frameworks, tools, and evolving technical specifications',
    defaultAaravScore: 88,
  },
  {
    index: 7,
    key: 'team_collaboration',
    label: 'Team Collaboration',
    shortLabel: 'Team',
    weightPercent: 10,
    description: 'Cross-functional teamwork, code review etiquette, and constructive conflict resolution',
    defaultAaravScore: 84,
  },
  {
    index: 8,
    key: 'professionalism',
    label: 'Professionalism',
    shortLabel: 'Prof',
    weightPercent: 5,
    description: 'Workplace conduct, punctuality, corporate readiness, and structured follow-through',
    defaultAaravScore: 86,
  },
  {
    index: 9,
    key: 'interview_poise',
    label: 'Interview Poise',
    shortLabel: 'Poise',
    weightPercent: 10,
    description: 'Behavioral structured responses (STAR method) and live technical walkthrough confidence',
    defaultAaravScore: 82,
  },
];

export interface WeightedDimensionRow extends EmployabilityDimensionDefinition {
  score: number;
  weightedPoints: number;
}

export function buildCandidate9DimensionBreakdown(
  overrides?: Partial<Record<EmployabilityDimensionDefinition['key'], number>>
): {
  methodologyVersion: string;
  dimensions: WeightedDimensionRow[];
  totalWeightPercent: number;
  weightedCompositeScore: number;
} {
  let totalWeightPercent = 0;
  let weightedSum = 0;

  const dimensions: WeightedDimensionRow[] = CANONICAL_9_EMPLOYABILITY_DIMENSIONS.map((dim) => {
    const score = overrides?.[dim.key] ?? dim.defaultAaravScore;
    const weightedPoints = Number(((score * dim.weightPercent) / 100).toFixed(2));
    totalWeightPercent += dim.weightPercent;
    weightedSum += weightedPoints;
    return {
      ...dim,
      score,
      weightedPoints,
    };
  });

  return {
    methodologyVersion: EMPLOYABILITY_SCORE_METHODOLOGY_VERSION,
    dimensions,
    totalWeightPercent,
    weightedCompositeScore: Number(weightedSum.toFixed(1)),
  };
}
