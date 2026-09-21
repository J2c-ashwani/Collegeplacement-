export interface StudentMatchProfile {
  id: string
  course: string
  branch: string
  graduationYear: number
  cgpa: number
  backlogs: number
  skills: string[]
  scores: {
    overall: number
    technicalReadiness: number
    communication: number
    workEthics: number
    learningAgility: number
    teamOrientation: number
    problemSolving: number
    professionalBehaviour: number
    interviewReadiness: number
  }
  badges: string[]
  preferredLocations: string[]
}

export interface JobMatchCriteria {
  id: string
  title: string
  degree: string[]
  branch: string[]
  graduationYear?: number | null
  minCgpa?: number | null
  backlogsAllowed: boolean
  skills: string[]
  minEmployabilityScore?: number | null
  minCommunicationScore?: number | null
  minTechnicalScore?: number | null
  minWorkEthicsScore?: number | null
  minLearningAgilityScore?: number | null
  requiredBadges: string[]
  location: string
}

export interface MatchResult {
  score: number // 0 - 100
  isEligible: boolean
  reasons: string[]
  failedCriteria: string[]
}

export function evaluateJobMatch(
  student: StudentMatchProfile,
  job: JobMatchCriteria
): MatchResult {
  const reasons: string[] = []
  const failedCriteria: string[] = []
  let scoreWeight = 0
  let earnedWeight = 0

  // 1. Degree & Course (Pass/Fail)
  if (job.degree && job.degree.length > 0 && !job.degree.includes('Any Graduate')) {
    scoreWeight += 10
    if (job.degree.some((d) => d.toLowerCase() === student.course.toLowerCase())) {
      earnedWeight += 10
      reasons.push(`Degree matches: ${student.course}`)
    } else {
      failedCriteria.push(`Degree mismatch (Requires: ${job.degree.join(', ')})`)
    }
  }

  // 2. Branch (Pass/Fail)
  if (job.branch && job.branch.length > 0 && !job.branch.includes('Any')) {
    scoreWeight += 10
    if (job.branch.some((b) => b.toLowerCase() === student.branch.toLowerCase())) {
      earnedWeight += 10
      reasons.push(`Branch matches: ${student.branch}`)
    } else {
      failedCriteria.push(`Branch mismatch (Requires: ${job.branch.join(', ')})`)
    }
  }

  // 3. Graduation Year
  if (job.graduationYear) {
    scoreWeight += 10
    if (student.graduationYear === job.graduationYear) {
      earnedWeight += 10
      reasons.push(`Graduation batch verified (${student.graduationYear})`)
    } else {
      failedCriteria.push(`Graduation batch mismatch (Requires: ${job.graduationYear})`)
    }
  }

  // 4. CGPA
  if (job.minCgpa) {
    scoreWeight += 10
    if (student.cgpa >= job.minCgpa) {
      earnedWeight += 10
      reasons.push(`CGPA ${student.cgpa.toFixed(2)} meets minimum requirement of ${job.minCgpa}`)
    } else {
      failedCriteria.push(`CGPA ${student.cgpa.toFixed(2)} is below required ${job.minCgpa}`)
    }
  }

  // 5. Backlogs
  if (!job.backlogsAllowed && student.backlogs > 0) {
    failedCriteria.push(`Has ${student.backlogs} active backlog(s) (no backlogs allowed)`)
  }

  // 6. Assessment Overall Threshold
  if (job.minEmployabilityScore) {
    scoreWeight += 15
    if (student.scores.overall >= job.minEmployabilityScore) {
      earnedWeight += 15
      reasons.push(`Employability score ${student.scores.overall}/100 exceeds threshold of ${job.minEmployabilityScore}`)
    } else {
      failedCriteria.push(`Employability score ${student.scores.overall}/100 is below threshold of ${job.minEmployabilityScore}`)
    }
  }

  // 7. Assessment Dimension Specific Thresholds
  if (job.minCommunicationScore) {
    scoreWeight += 10
    if (student.scores.communication >= job.minCommunicationScore) {
      earnedWeight += 10
      reasons.push(`Communication score ${student.scores.communication}/100 meets threshold of ${job.minCommunicationScore}`)
    } else {
      failedCriteria.push(`Communication score ${student.scores.communication}/100 below required ${job.minCommunicationScore}`)
    }
  }

  if (job.minTechnicalScore) {
    scoreWeight += 10
    if (student.scores.technicalReadiness >= job.minTechnicalScore) {
      earnedWeight += 10
      reasons.push(`Technical score ${student.scores.technicalReadiness}/100 meets threshold of ${job.minTechnicalScore}`)
    } else {
      failedCriteria.push(`Technical score ${student.scores.technicalReadiness}/100 below required ${job.minTechnicalScore}`)
    }
  }

  // 8. Badges
  if (job.requiredBadges && job.requiredBadges.length > 0) {
    scoreWeight += 10
    const matchedBadges = job.requiredBadges.filter((b) => student.badges.includes(b))
    if (matchedBadges.length === job.requiredBadges.length) {
      earnedWeight += 10
      reasons.push(`Holds all required badges: ${matchedBadges.join(', ')}`)
    } else {
      const missing = job.requiredBadges.filter((b) => !student.badges.includes(b))
      failedCriteria.push(`Missing required badge(s): ${missing.join(', ')}`)
    }
  }

  // 9. Skills Overlap
  if (job.skills && job.skills.length > 0) {
    scoreWeight += 15
    const studentSkillsLower = student.skills.map((s) => s.toLowerCase())
    const matchedSkills = job.skills.filter((s) => studentSkillsLower.includes(s.toLowerCase()))
    const skillRatio = matchedSkills.length / job.skills.length
    earnedWeight += Math.round(skillRatio * 15)

    if (matchedSkills.length > 0) {
      reasons.push(`Key matching skills: ${matchedSkills.join(', ')}`)
    }
  }

  const finalScore = scoreWeight > 0 ? Math.round((earnedWeight / scoreWeight) * 100) : 75
  const isEligible = failedCriteria.length === 0

  return {
    score: finalScore,
    isEligible,
    reasons,
    failedCriteria,
  }
}
