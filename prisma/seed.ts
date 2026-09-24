import { PrismaClient, Role, UserStatus, StudentStatus, InstitutionStatus, InstitutionType, MembershipStatus, ProgrammeStatus, AssuranceStatus, AssessmentStatus, AssessmentCategory, QuestionType, EmployerStatus, EmployerSize, JobStatus, JobType, WorkMode, FeeType, FeeTrigger, ApplicationStatus, OpportunityStatus, InterviewStatus, InterviewMode, OfferStatus, PlacementStatus, RosterInvitationStatus, WorkshopStatus, ActivityType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting PlacementConnect database seed...')

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10)
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10)

  // 1. Settings
  console.log('1. Seeding system settings...')
  const defaultSettings = [
    { key: 'ASSURANCE_INTERVIEW_TARGET', value: 3, category: 'ASSURANCE', description: 'Default qualified interview opportunities target' },
    { key: 'DEFAULT_GST_PERCENT', value: 18, category: 'TAX', description: 'Goods & Services Tax percentage' },
    { key: 'PLATFORM_NAME', value: 'PlacementConnect', category: 'BRANDING', description: 'Platform display name' },
    { key: 'SUPPORT_EMAIL', value: 'support@placementconnect.com', category: 'COMMUNICATION', description: 'Platform support email' },
    { key: 'ALLOW_STUDENT_SELF_REGISTRATION', value: false, category: 'REGISTRATION', description: 'Require institution link for registration' },
  ]
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // 2. Super Admin & Operations Users
  console.log('2. Seeding platform admins...')
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@placementconnect.com' },
    update: {},
    create: {
      email: 'admin@placementconnect.com',
      name: 'Super Admin',
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  const opsAdmin = await prisma.user.upsert({
    where: { email: 'ops@placementconnect.com' },
    update: {},
    create: {
      email: 'ops@placementconnect.com',
      name: 'Placement Operations Manager',
      passwordHash: defaultPasswordHash,
      role: Role.OPERATIONS,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  // 3. Institution Plans (Aligned with src/config/commercial-policy.ts: ₹15,000/yr)
  console.log('3. Seeding institution membership plans...')
  const partnerPlan = await prisma.institutionPlan.upsert({
    where: { slug: 'partner' },
    update: { price: 15000 },
    create: {
      name: 'Institutional Placement Operating System',
      slug: 'partner',
      description: 'Annual institutional placement OS license with four-level cohort reporting and QR onboarding.',
      price: 15000,
      gstPercent: 18,
      durationMonths: 12,
      features: [
        'Dedicated student registration portal & Campus Code',
        'Four-level cohort placement reporting (Full Batch, Opted, Programme, Assessed)',
        'Structured CSV/PDF summaries designed to support institutional placement documentation',
        'Placement verification & documentation vault',
        'Dedicated Institutional Partnerships Desk support'
      ],
      sortOrder: 1,
    },
  })

  const placementPlan = await prisma.institutionPlan.upsert({
    where: { slug: 'placement' },
    update: { price: 15000, durationMonths: 12 },
    create: {
      name: '1-Year Campus Placement Membership',
      slug: 'placement',
      description: 'Comprehensive placement partnership with four-level cohort reporting, assessment drives and employer network access.',
      price: 15000,
      gstPercent: 18,
      durationMonths: 12,
      features: [
        'All Institutional Placement OS features',
        'Up to 1,500 student registrations',
        'Priority employer drive matching',
        '9-Dimension Employability Assessment administration',
        'Structured exports designed to support institutional placement documentation',
        'Dedicated TPO relationship manager'
      ],
      sortOrder: 2,
    },
  })

  const placementPlusPlan = await prisma.institutionPlan.upsert({
    where: { slug: 'placement-5yr' },
    update: { price: 60000, durationMonths: 60 },
    create: {
      name: '5-Year Multi-Cohort Institutional Agreement',
      slug: 'placement-5yr',
      description: 'Multi-year institutional agreement covering 5 academic cohorts with multi-batch benchmarking and campus drives.',
      price: 60000,
      gstPercent: 18,
      durationMonths: 60,
      features: [
        'All Institutional Placement OS features for 5 continuous academic years',
        'Unlimited student registrations across 5 graduating batches',
        'Multi-cohort placement documentation & historical export archive',
        'Formal 5-year institutional MoU governance',
        'Department-wise placement benchmarking',
        'Quarterly Executive & Principal review meetings'
      ],
      sortOrder: 3,
    },
  })

  // 4. Student Programme Plans (Aligned with src/config/commercial-policy.ts: ₹1,000 and ₹2,500)
  console.log('4. Seeding student programme plans...')
  const assurancePlan = await prisma.programmePlan.upsert({
    where: { slug: 'placement-assurance' },
    update: { price: 1000 },
    create: {
      name: 'Graduate Assessment & 3-Interview Assurance Track',
      slug: 'placement-assurance',
      description: '9-Dimension Employability Evaluation, Verifiable Readiness Credential, and 3 Guaranteed Employer Interviews.',
      price: 1000,
      gstPercent: 18,
      durationMonths: 12,
      features: [
        'Complete 9-Dimension Employability Evaluation',
        'Verifiable digital scorecard & credential (/verify/[id])',
        'Minimum of 3 verified corporate interview opportunities within 12 months',
        '100% Base Fee Refund Guarantee (₹1,000) if 3 interviews are not facilitated',
        'Student-controlled profile visibility'
      ],
      sortOrder: 1,
    },
  })

  const assurancePlusPlan = await prisma.programmePlan.upsert({
    where: { slug: 'placement-plus-student' },
    update: { price: 2500 },
    create: {
      name: 'Advanced Career Readiness & Priority Drive Track',
      slug: 'placement-plus-student',
      description: 'Everything in the ₹1,000 Assurance Track plus a second post-preparation evaluation attempt and priority pooled drive shortlisting.',
      price: 2500,
      gstPercent: 18,
      durationMonths: 12,
      features: [
        'Everything in the ₹1,000 Graduate Assessment & 3-Interview Assurance Track',
        'Two assessment attempts (baseline + post-preparation evaluation)',
        'Structured communication, analytical, and domain preparation modules',
        'Priority shortlist routing for multi-campus pooled hiring drives',
        '100% Base Fee Refund Guarantee (₹2,500) if 3 interviews are not facilitated'
      ],
      sortOrder: 2,
    },
  })

  // 5. Badges
  console.log('5. Seeding employability badges...')
  const badgesList = [
    { name: 'Interview Ready', slug: 'interview-ready', description: 'Demonstrated overall interview readiness score above 75.' },
    { name: 'Employer Ready', slug: 'employer-ready', description: 'Overall employability score above 80 across all dimensions.' },
    { name: 'Strong Communicator', slug: 'strong-communicator', description: 'Scored 80+ in situational and professional communication.' },
    { name: 'High Learning Agility', slug: 'high-learning-agility', description: 'Exemplary problem solving and adaptability in unfamiliar contexts.' },
    { name: 'Team Player', slug: 'team-player', description: 'High collaborative and constructive conflict-resolution aptitude.' },
    { name: 'Technical Ready', slug: 'technical-ready', description: 'Solid foundational technical competencies evaluated.' },
    { name: 'Sales Ready', slug: 'sales-ready', description: 'High career motivation, resilience and persuasive communication.' },
    { name: 'Customer Success Ready', slug: 'customer-success-ready', description: 'Strong empathy, active listening and solution-orientation.' },
    { name: 'High Professionalism', slug: 'high-professionalism', description: 'Strong work ethics, accountability and workplace integrity.' },
  ]
  const createdBadges: Record<string, any> = {}
  for (const b of badgesList) {
    createdBadges[b.slug] = await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, criteria: { minScore: 75 } },
    })
  }

  // 6. Assessment Questions (9 Categories)
  console.log('6. Seeding assessment questions...')
  const questionsData = [
    // COMMUNICATION
    {
      category: AssessmentCategory.COMMUNICATION,
      questionType: QuestionType.SITUATIONAL,
      question: 'A client sends an urgent email expressing dissatisfaction with an unexpected delay caused by technical issues. What is your immediate response?',
      options: [
        { text: 'Acknowledge the issue immediately, express empathy, explain the cause briefly and commit to an updated realistic delivery window.', score: 10 },
        { text: 'Wait until the technical issue is completely fixed before replying so you have a complete answer.', score: 4 },
        { text: 'Forward the email to the technical lead and tell the client it is out of your hands.', score: 1 },
        { text: 'Reply reassuring them everything is fine and there is no real issue.', score: 0 }
      ],
      correctAnswer: 'Acknowledge the issue immediately, express empathy, explain the cause briefly and commit to an updated realistic delivery window.',
      weight: 1.2,
      difficulty: 2
    },
    {
      category: AssessmentCategory.COMMUNICATION,
      questionType: QuestionType.MCQ,
      question: 'In a remote team environment, what is the best practice for communicating critical blockers?',
      options: [
        { text: 'Post a clear, concise message in the project channel with context, steps taken, and exact assistance required.', score: 10 },
        { text: 'Wait until the weekly standup meeting to raise it.', score: 2 },
        { text: 'Send private messages to everyone in the team at the same time.', score: 4 },
        { text: 'Switch to a different task without telling anyone.', score: 0 }
      ],
      correctAnswer: 'Post a clear, concise message in the project channel with context, steps taken, and exact assistance required.',
      weight: 1.0,
      difficulty: 1
    },
    // WORK ETHICS
    {
      category: AssessmentCategory.WORK_ETHICS,
      questionType: QuestionType.SITUATIONAL,
      question: 'You notice a colleague accidentally pushed an unverified configuration change that might cause downtime later. The colleague has already left for the day. What do you do?',
      options: [
        { text: 'Flag the issue to the on-call engineer or team lead with details and offer to assist with reverting or fixing.', score: 10 },
        { text: 'Ignore it because it was not your mistake and wait until morning.', score: 1 },
        { text: 'Post publicly criticising the colleague on social media.', score: 0 },
        { text: 'Silently delete their code without testing or notifying anyone.', score: 3 }
      ],
      correctAnswer: 'Flag the issue to the on-call engineer or team lead with details and offer to assist with reverting or fixing.',
      weight: 1.2,
      difficulty: 2
    },
    // LEARNING AGILITY
    {
      category: AssessmentCategory.LEARNING_AGILITY,
      questionType: QuestionType.SITUATIONAL,
      question: 'Your manager assigns you a project that uses a modern tool and framework you have never used before. How do you approach this?',
      options: [
        { text: 'Break down the requirements, spend focused time on official docs and starter tutorials, build a quick prototype, and ask targeted questions.', score: 10 },
        { text: 'Tell the manager you cannot do it because you were not taught this in college.', score: 0 },
        { text: 'Copy-paste code randomly from online forums without understanding how it works.', score: 2 },
        { text: 'Delay starting until someone gives you comprehensive personal training.', score: 2 }
      ],
      correctAnswer: 'Break down the requirements, spend focused time on official docs and starter tutorials, build a quick prototype, and ask targeted questions.',
      weight: 1.0,
      difficulty: 2
    },
    // PROBLEM SOLVING
    {
      category: AssessmentCategory.PROBLEM_SOLVING,
      questionType: QuestionType.SCENARIO,
      question: 'You are troubleshooting a performance slowdown that affects 10% of users. What is the most structured diagnostic approach?',
      options: [
        { text: 'Analyze logs and metrics to identify patterns (browser, location, data size), reproduce under the same conditions, isolate the root cause, test a fix.', score: 10 },
        { text: 'Restart all servers immediately without checking logs.', score: 3 },
        { text: 'Assume it is an issue with the user internet and close the tickets.', score: 1 },
        { text: 'Rewrite the entire codebase from scratch.', score: 0 }
      ],
      correctAnswer: 'Analyze logs and metrics to identify patterns (browser, location, data size), reproduce under the same conditions, isolate the root cause, test a fix.',
      weight: 1.2,
      difficulty: 3
    },
    // TEAM BEHAVIOUR
    {
      category: AssessmentCategory.TEAM_BEHAVIOUR,
      questionType: QuestionType.SITUATIONAL,
      question: 'During a team brainstorming session, another team member strongly disagrees with your technical design. How do you respond?',
      options: [
        { text: 'Listen constructively to their reasoning, evaluate pros and cons objectively, and collaboratively converge on the best approach for the project.', score: 10 },
        { text: 'Get defensive and insist your solution is the only correct one.', score: 1 },
        { text: 'Refuse to contribute to the project from that point on.', score: 0 },
        { text: 'Complain to executive leadership immediately without discussing with the colleague.', score: 2 }
      ],
      correctAnswer: 'Listen constructively to their reasoning, evaluate pros and cons objectively, and collaboratively converge on the best approach for the project.',
      weight: 1.0,
      difficulty: 1
    },
    // PROFESSIONAL BEHAVIOUR
    {
      category: AssessmentCategory.PROFESSIONAL_BEHAVIOUR,
      questionType: QuestionType.LIKERT,
      question: 'I consistently arrive 5 minutes before scheduled meetings prepared with relevant agenda notes.',
      options: [
        { text: 'Strongly Agree', score: 10 },
        { text: 'Agree', score: 8 },
        { text: 'Neutral', score: 5 },
        { text: 'Disagree', score: 2 },
        { text: 'Strongly Disagree', score: 0 }
      ],
      weight: 1.0,
      difficulty: 1
    },
    // CAREER MOTIVATION
    {
      category: AssessmentCategory.CAREER_MOTIVATION,
      questionType: QuestionType.SITUATIONAL,
      question: 'When choosing your first professional job, which factor matters most to your long-term growth?',
      options: [
        { text: 'A supportive learning environment with experienced mentors and challenging hands-on projects.', score: 10 },
        { text: 'The highest possible starting title regardless of actual responsibilities.', score: 3 },
        { text: 'A position where minimum effort is expected.', score: 0 },
        { text: 'Solely brand name, even if doing repetitive non-technical data entry.', score: 4 }
      ],
      correctAnswer: 'A supportive learning environment with experienced mentors and challenging hands-on projects.',
      weight: 1.0,
      difficulty: 1
    },
    // SKILLS
    {
      category: AssessmentCategory.SKILLS,
      questionType: QuestionType.MCQ,
      question: 'What is the primary benefit of using database indexing on frequently queried columns?',
      options: [
        { text: 'Significantly improves SELECT query search speed at the cost of slight overhead on write operations.', score: 10 },
        { text: 'Guarantees the database cannot be hacked.', score: 0 },
        { text: 'Eliminates the need for writing foreign key constraints.', score: 2 },
        { text: 'Compresses image files stored in the database.', score: 0 }
      ],
      correctAnswer: 'Significantly improves SELECT query search speed at the cost of slight overhead on write operations.',
      weight: 1.2,
      difficulty: 2
    },
    {
      category: AssessmentCategory.WORKPLACE_PREFERENCES,
      questionType: QuestionType.MCQ,
      question: 'How do you prefer receiving feedback on your work?',
      options: [
        { text: 'Regular, direct, and actionable feedback focused on specific outcomes and improvement areas.', score: 10 },
        { text: 'Only in formal annual reviews once a year.', score: 3 },
        { text: 'I prefer not receiving any feedback.', score: 0 },
        { text: 'Informal feedback only when I request it.', score: 6 }
      ],
      correctAnswer: 'Regular, direct, and actionable feedback focused on specific outcomes and improvement areas.',
      weight: 1.0,
      difficulty: 1
    }
  ]

  for (const q of questionsData) {
    const existing = await prisma.assessmentQuestion.findFirst({
      where: { question: q.question }
    })
    if (!existing) {
      await prisma.assessmentQuestion.create({
        data: q as any
      })
    }
  }

  // 7. Institutions
  console.log('7. Seeding 3 partner institutions...')
  const institutionsData = [
    {
      name: 'Apex Institute of Technology',
      code: 'apex-tech',
      registrationCode: 'APX123',
      type: InstitutionType.ENGINEERING,
      universityAffiliation: 'Mumbai University',
      accreditation: 'NAAC A+',
      address: 'Sector 15, Vashi',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400703',
      website: 'https://apextech.edu.in',
      principalName: 'Dr. Ramesh Sharma',
      tpoName: 'Prof. Anjali Mehta',
      tpoEmail: 'tpo@apextech.edu.in',
      officialPhone: '+91 9820011223',
      estimatedStudentCount: 1200,
      departments: ['Computer Science', 'Information Technology', 'Electronics & Telecommunication', 'Mechanical'],
      graduationBatches: ['2025', '2026'],
      placementPercentage: 74.5,
      status: InstitutionStatus.APPROVED,
    },
    {
      name: 'National Institute of Science & Management',
      code: 'nism-pune',
      registrationCode: 'NSM456',
      type: InstitutionType.MANAGEMENT,
      universityAffiliation: 'Savitribai Phule Pune University',
      accreditation: 'NAAC A',
      address: 'Kothrud Campus',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      website: 'https://nismpune.ac.in',
      principalName: 'Dr. Sunita Deshmukh',
      tpoName: 'Vikram Joshi',
      tpoEmail: 'tpo@nismpune.ac.in',
      officialPhone: '+91 9821144556',
      estimatedStudentCount: 800,
      departments: ['MBA Marketing', 'MBA Finance', 'MCA', 'BBA'],
      graduationBatches: ['2025', '2026'],
      placementPercentage: 68.0,
      status: InstitutionStatus.APPROVED,
    },
    {
      name: 'St. Xavier Engineering College',
      code: 'st-xavier',
      registrationCode: 'STX789',
      type: InstitutionType.ENGINEERING,
      universityAffiliation: 'Bengaluru City University',
      accreditation: 'NBA Accredited',
      address: 'Whitefield Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      website: 'https://stxaviertech.edu',
      principalName: 'Fr. Thomas Varghese',
      tpoName: 'Rajesh Nair',
      tpoEmail: 'tpo@stxaviertech.edu',
      officialPhone: '+91 9845012345',
      estimatedStudentCount: 1000,
      departments: ['Computer Science', 'AI & Data Science', 'Electrical Engineering'],
      graduationBatches: ['2026'],
      placementPercentage: 81.2,
      status: InstitutionStatus.APPROVED,
    }
  ]

  const institutions: any[] = []
  for (const inst of institutionsData) {
    const institution = await prisma.institution.upsert({
      where: { code: inst.code },
      update: {},
      create: inst,
    })
    institutions.push(institution)

    // Create TPO User
    const tpoUser = await prisma.user.upsert({
      where: { email: inst.tpoEmail },
      update: {},
      create: {
        email: inst.tpoEmail,
        name: inst.tpoName,
        passwordHash: defaultPasswordHash,
        role: Role.INSTITUTION_ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      }
    })

    await prisma.institutionUser.upsert({
      where: { id: `iu-${inst.code}` },
      update: {},
      create: {
        id: `iu-${inst.code}`,
        userId: tpoUser.id,
        institutionId: institution.id,
        designation: 'Head — Training & Placement Officer',
        isPrimary: true,
      }
    })

    // Active Membership for Apex & St. Xavier; Pending for NISM
    const plan = inst.code === 'st-xavier' ? placementPlusPlan : placementPlan
    const membership = await prisma.institutionMembership.upsert({
      where: { id: `mem-${inst.code}` },
      update: {},
      create: {
        id: `mem-${inst.code}`,
        institutionId: institution.id,
        planId: plan.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        status: MembershipStatus.ACTIVE,
        activatedAt: new Date(),
      }
    })

    // Roster of expected students
    const roster = await prisma.institutionRoster.upsert({
      where: { id: `roster-${inst.code}-2026` },
      update: {},
      create: {
        id: `roster-${inst.code}-2026`,
        institutionId: institution.id,
        graduationYear: 2026,
        totalExpectedStudents: 600,
        importedBy: tpoUser.id,
        status: 'ACTIVE'
      }
    })
  }

  const primaryInstitution = institutions[0] // Apex Tech

  // 8. Seed 50 Roster Students for Apex (Demonstrating Denominator 600)
  console.log('8. Seeding student roster entries...')
  for (let i = 1; i <= 50; i++) {
    const pad = String(i).padStart(3, '0')
    await prisma.rosterStudent.upsert({
      where: { id: `roster-stu-apex-${pad}` },
      update: {},
      create: {
        id: `roster-stu-apex-${pad}`,
        rosterId: `roster-apex-tech-2026`,
        institutionId: primaryInstitution.id,
        name: `Student Candidate ${pad}`,
        enrollmentNumber: `APX2026CS${pad}`,
        email: `student${pad}@apextech.edu.in`,
        mobile: `+91 9800000${pad}`,
        course: 'B.Tech',
        branch: i % 2 === 0 ? 'Computer Science' : 'Information Technology',
        department: 'Engineering',
        graduationYear: 2026,
        cgpa: 7.2 + (i % 25) * 0.1,
        invitationStatus: i <= 20 ? RosterInvitationStatus.REGISTERED : RosterInvitationStatus.SENT,
        invitationSentAt: new Date(),
      }
    })
  }

  // 9. Employers & Fee Rules
  console.log('9. Seeding partner employers...')
  const employersData = [
    {
      name: 'TechCorp Solutions',
      industry: 'IT & Software Development',
      size: EmployerSize.MEDIUM,
      website: 'https://techcorp-solutions.example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      status: EmployerStatus.APPROVED,
      recruiterName: 'Kavita Rao',
      recruiterEmail: 'recruiter@techcorp.example.com',
    },
    {
      name: 'CloudNova Systems',
      industry: 'Cloud Infrastructure & DevOps',
      size: EmployerSize.STARTUP,
      website: 'https://cloudnova.example.com',
      city: 'Pune',
      state: 'Maharashtra',
      status: EmployerStatus.APPROVED,
      recruiterName: 'Amit Saxena',
      recruiterEmail: 'amit@cloudnova.example.com',
    },
    {
      name: 'FinEdge Analytics',
      industry: 'Fintech & Data Engineering',
      size: EmployerSize.LARGE,
      website: 'https://finedge.example.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      status: EmployerStatus.APPROVED,
      recruiterName: 'Pooja Iyer',
      recruiterEmail: 'pooja@finedge.example.com',
    },
    {
      name: 'NexaRetail Digital',
      industry: 'E-commerce & Retail Tech',
      size: EmployerSize.MEDIUM,
      website: 'https://nexaretail.example.com',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      status: EmployerStatus.APPROVED,
      recruiterName: 'Rohan Gupta',
      recruiterEmail: 'rohan@nexaretail.example.com',
    },
    {
      name: 'GrowthPulse Media',
      industry: 'Digital Marketing & Inside Sales',
      size: EmployerSize.STARTUP,
      website: 'https://growthpulse.example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      status: EmployerStatus.APPROVED,
      recruiterName: 'Sanjay Mehra',
      recruiterEmail: 'sanjay@growthpulse.example.com',
    }
  ]

  const employers: any[] = []
  for (const emp of employersData) {
    const employer = await prisma.employer.upsert({
      where: { id: `emp-${emp.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
      update: {},
      create: {
        id: `emp-${emp.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: emp.name,
        industry: emp.industry,
        size: emp.size,
        website: emp.website,
        city: emp.city,
        state: emp.state,
        status: emp.status,
        verifiedAt: new Date(),
        verifiedBy: superAdmin.id,
      }
    })
    employers.push(employer)

    // Recruiter user
    const recruiterUser = await prisma.user.upsert({
      where: { email: emp.recruiterEmail },
      update: {},
      create: {
        email: emp.recruiterEmail,
        name: emp.recruiterName,
        passwordHash: defaultPasswordHash,
        role: Role.EMPLOYER,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      }
    })

    await prisma.employerUser.upsert({
      where: { id: `eu-${employer.id}` },
      update: {},
      create: {
        id: `eu-${employer.id}`,
        userId: recruiterUser.id,
        employerId: employer.id,
        designation: 'Talent Acquisition Specialist',
        isPrimary: true,
      }
    })

    // Employer Fee Rule (Success Fee on joining: ₹10,000)
    await prisma.employerFeeRule.upsert({
      where: { id: `fee-rule-${employer.id}` },
      update: {},
      create: {
        id: `fee-rule-${employer.id}`,
        employerId: employer.id,
        feeType: FeeType.SUCCESS_FEE,
        feeAmount: 10000,
        feeCurrency: 'INR',
        trigger: FeeTrigger.CANDIDATE_JOINED,
        isActive: true,
      }
    })
  }

  // 10. Jobs with Assessment Thresholds
  console.log('10. Seeding fresher job postings with assessment criteria...')
  const jobsData = [
    {
      id: 'job-techcorp-sde',
      employerId: employers[0].id,
      title: 'Junior Full-Stack Software Engineer',
      department: 'Engineering',
      type: JobType.FULL_TIME,
      location: 'Bengaluru',
      workMode: WorkMode.HYBRID,
      salaryMin: 450000,
      salaryMax: 600000,
      ctc: 550000,
      degree: ['B.Tech', 'BE', 'MCA'],
      branch: ['Computer Science', 'Information Technology'],
      graduationYear: 2026,
      minCgpa: 7.0,
      backlogsAllowed: false,
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      minEmployabilityScore: 75,
      minTechnicalScore: 70,
      minCommunicationScore: 65,
      requiredBadges: ['Technical Ready'],
      openings: 5,
      description: 'Exciting opportunity for 2026 freshers to build scalable cloud SaaS applications with modern web stacks.',
      status: JobStatus.ACTIVE,
      approvedBy: superAdmin.id,
      approvedAt: new Date(),
    },
    {
      id: 'job-cloudnova-devops',
      employerId: employers[1].id,
      title: 'Associate Cloud & DevOps Engineer',
      department: 'Infrastructure',
      type: JobType.FULL_TIME,
      location: 'Pune',
      workMode: WorkMode.ONSITE,
      salaryMin: 400000,
      salaryMax: 500000,
      ctc: 480000,
      degree: ['B.Tech', 'BE'],
      branch: ['Computer Science', 'Electronics & Telecommunication', 'Information Technology'],
      graduationYear: 2026,
      minCgpa: 6.8,
      backlogsAllowed: false,
      skills: ['Linux', 'Docker', 'AWS', 'Python', 'Networking'],
      minEmployabilityScore: 70,
      minTechnicalScore: 70,
      minLearningAgilityScore: 75,
      requiredBadges: ['High Learning Agility'],
      openings: 3,
      description: 'Hands-on role supporting automated CI/CD pipelines, container orchestration and multi-cloud environments.',
      status: JobStatus.ACTIVE,
      approvedBy: superAdmin.id,
      approvedAt: new Date(),
    },
    {
      id: 'job-growthpulse-sales',
      employerId: employers[4].id,
      title: 'Inside Sales Executive — Enterprise SaaS',
      department: 'Revenue & Sales',
      type: JobType.FULL_TIME,
      location: 'Bengaluru',
      workMode: WorkMode.HYBRID,
      salaryMin: 400000,
      salaryMax: 550000,
      ctc: 500000,
      degree: ['B.Tech', 'BBA', 'B.Sc', 'Any Graduate'],
      branch: ['Any'],
      graduationYear: 2026,
      minCgpa: 6.0,
      backlogsAllowed: true,
      skills: ['B2B Sales', 'Prospecting', 'Excellent English', 'CRM'],
      minEmployabilityScore: 70,
      minCommunicationScore: 80,
      minWorkEthicsScore: 70,
      requiredBadges: ['Strong Communicator', 'Sales Ready'],
      openings: 8,
      description: 'Drive high-velocity SaaS demos and qualified enterprise pipeline across Indian and global mid-markets.',
      status: JobStatus.ACTIVE,
      approvedBy: superAdmin.id,
      approvedAt: new Date(),
    }
  ]

  const createdJobs: any[] = []
  for (const j of jobsData) {
    const job = await prisma.job.upsert({
      where: { id: j.id },
      update: {},
      create: j,
    })
    createdJobs.push(job)
  }

  // 11. Students (20 accounts: enrolled, paid, assessed)
  console.log('11. Seeding enrolled student profiles and programmes...')
  const sampleStudents = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@apextech.edu.in', score: 84, placed: true },
    { name: 'Diya Patel', email: 'diya.patel@apextech.edu.in', score: 81, placed: true },
    { name: 'Rohan Deshmukh', email: 'rohan.deshmukh@apextech.edu.in', score: 79, placed: false },
    { name: 'Ananya Verma', email: 'ananya.verma@apextech.edu.in', score: 76, placed: false },
    { name: 'Ishaan Kulkarni', email: 'ishaan.k@apextech.edu.in', score: 88, placed: false },
  ]

  for (let i = 0; i < sampleStudents.length; i++) {
    const stu = sampleStudents[i]
    const user = await prisma.user.upsert({
      where: { email: stu.email },
      update: {},
      create: {
        email: stu.email,
        name: stu.name,
        passwordHash: defaultPasswordHash,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      }
    })

    const studentRecord = await prisma.student.upsert({
      where: { id: `stu-${i + 1}` },
      update: {},
      create: {
        id: `stu-${i + 1}`,
        userId: user.id,
        institutionId: primaryInstitution.id,
        enrollmentNumber: `APX2026CS${String(i + 1).padStart(3, '0')}`,
        status: stu.placed ? StudentStatus.PLACED : StudentStatus.ACTIVE,
        verificationId: `STU-2026-${String(i + 1).padStart(6, '0')}`,
        registrationSource: 'INSTITUTION_URL',
      }
    })

    // Profile
    await prisma.studentProfile.upsert({
      where: { studentId: studentRecord.id },
      update: {},
      create: {
        studentId: studentRecord.id,
        course: 'B.Tech',
        branch: 'Computer Science',
        department: 'Engineering',
        graduationYear: 2026,
        cgpa: 8.2 + (i * 0.2),
        tenthPercentage: 88.5,
        twelfthPercentage: 85.0,
        backlogs: 0,
        location: 'Navi Mumbai',
        preferredLocations: ['Mumbai', 'Bengaluru', 'Pune'],
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind'],
        languages: ['English', 'Hindi'],
        preferredRoles: ['Software Engineer', 'Full-Stack Developer'],
        salaryExpectation: 500000,
        employerVisibilityConsent: true,
        employerVisibilityConsentAt: new Date(),
      }
    })

    // Student Programme
    const studentProg = await prisma.studentProgramme.upsert({
      where: { id: `prog-${studentRecord.id}` },
      update: {},
      create: {
        id: `prog-${studentRecord.id}`,
        studentId: studentRecord.id,
        programmePlanId: assurancePlan.id,
        institutionId: primaryInstitution.id,
        institutionMembershipId: `mem-${primaryInstitution.code}`,
        status: stu.placed ? ProgrammeStatus.PLACED : ProgrammeStatus.ACTIVE,
        assuranceTarget: 3,
        assuranceStartDate: new Date(),
        assuranceEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        studentObligationsAccepted: new Date(),
        opportunitiesConsumed: stu.placed ? 1 : (i === 2 ? 1 : 0),
        opportunitiesRemaining: stu.placed ? 2 : (i === 2 ? 2 : 3),
        assuranceStatus: stu.placed ? AssuranceStatus.PLACED : AssuranceStatus.ACTIVE,
      }
    })

    // Assessment Result
    const assessment = await prisma.studentAssessment.upsert({
      where: { id: `assess-${studentRecord.id}` },
      update: {},
      create: {
        id: `assess-${studentRecord.id}`,
        studentId: studentRecord.id,
        status: AssessmentStatus.COMPLETED,
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(),
      }
    })

    await prisma.assessmentResult.upsert({
      where: { assessmentId: assessment.id },
      update: {},
      create: {
        assessmentId: assessment.id,
        studentId: studentRecord.id,
        overallScore: stu.score,
        technicalReadiness: stu.score - 2,
        communication: stu.score + 1,
        workEthics: 82,
        learningAgility: 85,
        teamOrientation: 80,
        problemSolving: stu.score - 1,
        professionalBehaviour: 85,
        interviewReadiness: stu.score,
      }
    })

    // Award Badges
    await prisma.studentBadge.upsert({
      where: { id: `sbadge-${studentRecord.id}-ir` },
      update: {},
      create: {
        id: `sbadge-${studentRecord.id}-ir`,
        studentId: studentRecord.id,
        badgeId: createdBadges['interview-ready'].id,
        score: stu.score,
        verificationId: `BDG-IR-${studentRecord.id}`,
      }
    })
    await prisma.studentBadge.upsert({
      where: { id: `sbadge-${studentRecord.id}-er` },
      update: {},
      create: {
        id: `sbadge-${studentRecord.id}-er`,
        studentId: studentRecord.id,
        badgeId: createdBadges['employer-ready'].id,
        score: stu.score,
        verificationId: `BDG-ER-${studentRecord.id}`,
      }
    })

    // Applications & Opportunities
    const targetJob = createdJobs[0] // TechCorp SDE
    const application = await prisma.application.upsert({
      where: { id: `app-${studentRecord.id}-${targetJob.id}` },
      update: {},
      create: {
        id: `app-${studentRecord.id}-${targetJob.id}`,
        studentId: studentRecord.id,
        jobId: targetJob.id,
        status: stu.placed ? ApplicationStatus.SELECTED : (i === 2 ? ApplicationStatus.REJECTED : ApplicationStatus.INTERVIEW_SCHEDULED),
        matchScore: stu.score + 5,
        matchReasons: {
          skillsMatch: true,
          cgpaMet: true,
          scoresMet: true,
          badgeAwarded: true
        }
      }
    })

    // Assurance Opportunity #1
    const opportunity = await prisma.assuranceOpportunity.upsert({
      where: { id: `opp-${studentRecord.id}-1` },
      update: {},
      create: {
        id: `opp-${studentRecord.id}-1`,
        studentProgrammeId: studentProg.id,
        studentId: studentRecord.id,
        employerId: targetJob.employerId,
        jobId: targetJob.id,
        applicationId: application.id,
        opportunityNumber: 1,
        status: stu.placed ? OpportunityStatus.SELECTED : (i === 2 ? OpportunityStatus.REJECTED : OpportunityStatus.INTERVIEW_SCHEDULED),
        countsTowardAssurance: true,
        completedDate: stu.placed || i === 2 ? new Date() : null,
        outcome: stu.placed ? 'Selected by employer' : (i === 2 ? 'Rejected after Technical Round 2' : null),
      }
    })

    // Interview rounds
    await prisma.interview.upsert({
      where: { id: `int-${opportunity.id}-r1` },
      update: {},
      create: {
        id: `int-${opportunity.id}-r1`,
        opportunityId: opportunity.id,
        applicationId: application.id,
        studentId: studentRecord.id,
        jobId: targetJob.id,
        employerId: targetJob.employerId,
        roundNumber: 1,
        roundName: 'Technical Screen & Coding Architecture',
        scheduledAt: new Date(Date.now() - 86400000),
        mode: InterviewMode.VIDEO,
        meetingLink: 'https://meet.google.com/xyz-demo-interview',
        status: InterviewStatus.COMPLETED,
        result: 'PASSED',
        completedAt: new Date(Date.now() - 82800000),
      }
    })

    // If placed, generate Offer, Placement, and Auto-trigger Employer Fee!
    if (stu.placed) {
      const offer = await prisma.offer.upsert({
        where: { id: `offer-${studentRecord.id}` },
        update: {},
        create: {
          id: `offer-${studentRecord.id}`,
          applicationId: application.id,
          opportunityId: opportunity.id,
          studentId: studentRecord.id,
          employerId: targetJob.employerId,
          jobId: targetJob.id,
          institutionId: primaryInstitution.id,
          offerDate: new Date(Date.now() - 7 * 86400000),
          ctc: 550000,
          fixedSalary: 500000,
          variableSalary: 50000,
          joiningDate: new Date('2026-07-01'),
          location: 'Bengaluru',
          employmentType: 'Full-Time',
          status: OfferStatus.JOINED,
        }
      })

      const placement = await prisma.placement.upsert({
        where: { offerId: offer.id },
        update: {},
        create: {
          offerId: offer.id,
          studentId: studentRecord.id,
          institutionId: primaryInstitution.id,
          employerId: targetJob.employerId,
          jobId: targetJob.id,
          placementCode: `PLC-2026-${String(i + 1).padStart(6, '0')}`,
          ctc: 550000,
          joiningDate: new Date('2026-07-01'),
          joinedAt: new Date(),
          status: PlacementStatus.VERIFIED,
          verifiedBy: superAdmin.id,
          verifiedAt: new Date(),
          verificationNotes: 'Offer letter and joining verification call verified by platform team.',
        }
      })

      // Employer Success Fee automatically generated
      await prisma.employerFee.upsert({
        where: { id: `efee-${placement.id}` },
        update: {},
        create: {
          id: `efee-${placement.id}`,
          employerFeeRuleId: `fee-rule-${targetJob.employerId}`,
          employerId: targetJob.employerId,
          placementId: placement.id,
          studentId: studentRecord.id,
          jobId: targetJob.id,
          amount: 10000,
          gstAmount: 1800,
          totalAmount: 11800,
          status: 'GENERATED',
          paymentDueDate: new Date(Date.now() + 30 * 86400000),
        }
      })
    }
  }

  // 12. Workshops
  console.log('12. Seeding upcoming career sessions & workshops...')
  await prisma.workshop.upsert({
    where: { id: 'ws-1' },
    update: {},
    create: {
      id: 'ws-1',
      title: 'Mastering the First 90 Days in a Tech Startup',
      topic: 'Workplace Readiness & Team Integration',
      speaker: 'Siddharth Nair, VP Engineering',
      company: 'TechCorp Solutions',
      date: new Date(Date.now() + 5 * 86400000),
      duration: 90,
      mode: 'Live Interactive Webinar',
      meetingLink: 'https://meet.google.com/ws-startup-prep',
      targetInstitutions: [primaryInstitution.id],
      targetDepartments: ['Computer Science', 'Information Technology'],
      description: 'Practical guide on how fresh engineers can deliver impact, navigate codebases and communicate effectively.',
      status: WorkshopStatus.PUBLISHED,
      maxParticipants: 300,
      createdBy: opsAdmin.id,
    }
  })

  // 13. Institutional Activity & MOU
  console.log('13. Seeding institutional MOU & activity records...')
  const mou = await prisma.mOU.upsert({
    where: { id: `mou-${primaryInstitution.code}` },
    update: {},
    create: {
      id: `mou-${primaryInstitution.code}`,
      institutionId: primaryInstitution.id,
      status: 'ACTIVE',
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 86400000),
      signedDate: new Date(),
      signatories: [
        'Dr. Ramesh Sharma (Principal, Apex Tech)',
        'Founder & CEO (PlacementConnect Platform)'
      ],
      notes: 'Annual institutional placement agreement covering Placement Assurance for final-year graduating batch.'
    }
  })

  await prisma.institutionActivity.upsert({
    where: { id: `act-${primaryInstitution.code}-1` },
    update: {},
    create: {
      id: `act-${primaryInstitution.code}-1`,
      institutionId: primaryInstitution.id,
      mouId: mou.id,
      type: ActivityType.PLACEMENT_DRIVE,
      title: '2026 Cloud & Software Engineering Placement Drive',
      date: new Date(Date.now() - 14 * 86400000),
      department: 'Computer Science & IT',
      participantCount: 140,
      speaker: 'Kavita Rao',
      company: 'TechCorp Solutions',
      mode: 'Hybrid Drive',
      attendanceCount: 135,
      report: 'Completed initial screening and round 1 technical coding challenges.',
      outcomes: '12 candidates shortlisted for round 2 technical evaluations.'
    }
  })

  // -------------------------------------------------------------
  // GrowthOS Baseline Seed Data (Track 5)
  // -------------------------------------------------------------
  console.log('Seeding GrowthOS Marketplace Intelligence data...')

  // 1. College Prospects
  const college1 = await prisma.collegeProspect.upsert({
    where: { normalizedDomain: 'abctech.edu.in' },
    update: {},
    create: {
      name: 'ABC Institute of Technology',
      normalizedDomain: 'abctech.edu.in',
      website: 'https://www.abctech.edu.in',
      city: 'Noida',
      state: 'Uttar Pradesh',
      region: 'Delhi NCR',
      courses: ['B.Tech Computer Science', 'BCA', 'MCA', 'MBA'],
      estimatedCohort: 820,
      icpScore: 86.4,
      icpBreakdown: {
        studentVolume: 24.6,
        courseRelevancy: 15.0,
        placementGap: 9.8,
        employerAccessibility: 10.0,
        tpoAccessibility: 10.0,
        studentAffordability: 7.5,
        industryMous: 4.5,
      },
      fitSummary: 'Premier Tier-2 technical institute in Delhi NCR with 820 graduating students in high-demand IT/Sales disciplines.',
      recommendedPitch: 'Extend ABC Institute of Technology placement outcomes with pre-assessed talent pipelines and guaranteed employer interview slots.',
      tpoName: 'Dr. Rakesh Verma',
      tpoEmail: 'tpo@abctech.edu.in',
      tpoPhone: '+91 98112 34567',
      principalName: 'Prof. S. K. Gupta',
      provenanceData: {
        sourceUrl: 'https://www.abctech.edu.in/placements',
        sourceType: 'OFFICIAL_INSTITUTION_DIRECTORY',
        retrievedAt: new Date().toISOString(),
        confidence: 0.95,
      },
      freshnessStatus: 'FRESH',
      complianceStatus: 'VERIFIED',
      status: 'ICP_SCORED',
    },
  })

  const college2 = await prisma.collegeProspect.upsert({
    where: { normalizedDomain: 'dmc.ac.in' },
    update: {},
    create: {
      name: 'Delhi Metropolitan College',
      normalizedDomain: 'dmc.ac.in',
      website: 'https://www.dmc.ac.in',
      city: 'New Delhi',
      state: 'Delhi',
      region: 'Delhi NCR',
      courses: ['BCA', 'BBA', 'B.Com', 'MCA'],
      estimatedCohort: 640,
      icpScore: 83.5,
      icpBreakdown: {
        studentVolume: 19.2,
        courseRelevancy: 15.0,
        placementGap: 10.5,
        employerAccessibility: 10.0,
        tpoAccessibility: 9.0,
        studentAffordability: 8.0,
        industryMous: 4.0,
      },
      fitSummary: 'High-density commercial college with 640 graduating students ideal for Inside Sales and Customer Operations roles.',
      recommendedPitch: 'Access PlacementConnect corporate partner network to absorb 640 graduating BCA/BBA students in verified corporate roles.',
      tpoName: 'Pooja Sharma',
      tpoEmail: 'placements@dmc.ac.in',
      tpoPhone: '+91 98710 54321',
      principalName: 'Dr. Anita Malhotra',
      provenanceData: {
        sourceUrl: 'https://www.dmc.ac.in/about',
        sourceType: 'OFFICIAL_INSTITUTION_DIRECTORY',
        retrievedAt: new Date().toISOString(),
        confidence: 0.92,
      },
      freshnessStatus: 'FRESH',
      complianceStatus: 'VERIFIED',
      status: 'DISCOVERED',
    },
  })

  const college3 = await prisma.collegeProspect.upsert({
    where: { normalizedDomain: 'maepune.ac.in' },
    update: {},
    create: {
      name: 'Maharashtra Academy of Engineering',
      normalizedDomain: 'maepune.ac.in',
      website: 'https://www.maepune.ac.in',
      city: 'Pune',
      state: 'Maharashtra',
      region: 'Pune',
      courses: ['B.Tech CSE', 'B.Tech Mechanical', 'B.Tech Civil'],
      estimatedCohort: 540,
      icpScore: 78.8,
      fitSummary: 'Established engineering academy in Pune IT corridor with 540 students seeking core and software placements.',
      tpoName: 'Sunil Deshmukh',
      tpoEmail: 'tpo@maepune.ac.in',
      provenanceData: {
        sourceUrl: 'https://www.maepune.ac.in',
        sourceType: 'OFFICIAL_INSTITUTION_DIRECTORY',
        retrievedAt: new Date().toISOString(),
        confidence: 0.90,
      },
      freshnessStatus: 'FRESH',
      complianceStatus: 'VERIFIED',
      status: 'DISCOVERED',
    },
  })

  // 2. Employer Prospects
  const emp1 = await prisma.employerProspect.upsert({
    where: { normalizedDomain: 'fintechhorizon.com' },
    update: {},
    create: {
      companyName: 'Fintech Horizon India Pvt Ltd',
      normalizedDomain: 'fintechhorizon.com',
      website: 'https://www.fintechhorizon.com',
      careersUrl: 'https://www.fintechhorizon.com/careers',
      industry: 'Financial Technology & Digital Banking',
      city: 'Gurgaon',
      state: 'Haryana',
      region: 'Delhi NCR',
      hiringVolume: 70,
      openRoles: ['Inside Sales Associate (50)', 'Customer Success Specialist (20)'],
      experienceRange: '0-2 Years',
      employerFitScore: 91.2,
      fitBreakdown: {
        hiringDemand: 15.0,
        fresherEligibility: 15.0,
        roleRelevance: 10.0,
        candidateMatch: 15.0,
        geographyMatch: 10.0,
        salaryFit: 10.0,
        hiringVolume: 10.0,
        interviewCapacity: 5.0,
        historicalConversion: 3.5,
        employerReliability: 4.5,
      },
      assuranceCoveragePotential: {
        openFresherRoles: 2,
        eligibleCandidatePool: 183,
        skillMatchCount: 76,
        regionalProximityCount: 32,
        deliverableSlotsThisMonth: 20,
        coverageYieldPercentage: 10.9,
      },
      matchedStudentCount: 183,
      matchedSkills: ['Inside Sales', 'Customer Success', 'Communication', 'Lead Qualification'],
      matchingRoles: ['Inside Sales Associate', 'Customer Success Specialist'],
      recruiterName: 'Vikram Sethi',
      recruiterEmail: 'vikram.sethi@fintechhorizon.com',
      recruiterTitle: 'Head of Campus Talent Acquisition',
      provenanceData: {
        sourceUrl: 'https://www.fintechhorizon.com/careers/freshers',
        sourceType: 'CORPORATE_CAREER_SITE',
        retrievedAt: new Date().toISOString(),
        confidence: 0.94,
      },
      freshnessStatus: 'FRESH',
      complianceStatus: 'VERIFIED',
      status: 'QUALIFIED',
    },
  })

  const emp2 = await prisma.employerProspect.upsert({
    where: { normalizedDomain: 'cloudscalesystems.com' },
    update: {},
    create: {
      companyName: 'CloudScale Systems India',
      normalizedDomain: 'cloudscalesystems.com',
      website: 'https://www.cloudscalesystems.com',
      careersUrl: 'https://www.cloudscalesystems.com/careers',
      industry: 'Cloud Infrastructure & Managed DevOps',
      city: 'Noida',
      state: 'Uttar Pradesh',
      region: 'Delhi NCR',
      hiringVolume: 35,
      openRoles: ['Associate Cloud Support Engineer (25)', 'Junior DevOps Trainee (10)'],
      experienceRange: '0-1 Years',
      employerFitScore: 88.5,
      fitBreakdown: {
        hiringDemand: 12.5,
        fresherEligibility: 15.0,
        roleRelevance: 10.0,
        candidateMatch: 14.0,
        geographyMatch: 10.0,
        salaryFit: 10.0,
        hiringVolume: 10.0,
        interviewCapacity: 5.0,
        historicalConversion: 4.0,
        employerReliability: 4.0,
      },
      matchedStudentCount: 124,
      matchedSkills: ['AWS/Cloud Basics', 'Linux Admin', 'Networking', 'Python Scripting'],
      matchingRoles: ['Associate Cloud Support Engineer'],
      recruiterName: 'Ananya Roy',
      recruiterEmail: 'ananya.roy@cloudscalesystems.com',
      recruiterTitle: 'Senior Technical Recruiter',
      provenanceData: {
        sourceUrl: 'https://www.cloudscalesystems.com/careers',
        sourceType: 'CORPORATE_CAREER_SITE',
        retrievedAt: new Date().toISOString(),
        confidence: 0.96,
      },
      freshnessStatus: 'FRESH',
      complianceStatus: 'VERIFIED',
      status: 'RECRUITER_IDENTIFIED',
    },
  })

  // 3. Sequences & Steps
  const collegeSeq = await prisma.outreachSequence.upsert({
    where: { id: 'seq-college-assurance-v1' },
    update: {},
    create: {
      id: 'seq-college-assurance-v1',
      name: 'College Placement Assurance Partnership Sequence',
      targetType: 'COLLEGE',
      description: '3-step sequence pitching placement assurance capacity, NAAC evidence readiness, and pre-assessed employer network.',
      isActive: true,
      steps: {
        create: [
          {
            stepNumber: 1,
            delayDays: 0,
            templateSubject: 'Extending placement outcomes for {{prospectName}} ({{cohort}} graduating cohort)',
            templateBody: 'Dear {{contactName}},\n\nWe noticed {{prospectName}} has a prominent graduating class of approximately {{cohort}} students across tech and business streams.\n\nPlacementConnect partners with colleges to complement internal TPO operations with pre-assessed employer networks, guaranteed interview quotas, and an automated NAAC/NIRF Placement Evidence Center.\n\nWould you be open for a brief 15-minute introductory call this Thursday to review our partner college model?',
            channel: 'EMAIL',
          },
          {
            stepNumber: 2,
            delayDays: 3,
            templateSubject: 'Re: 15-min placement collaboration for {{prospectName}}',
            templateBody: 'Hi {{contactName}},\n\nFollowing up on my previous message. Across Delhi NCR institutions, our verified placement assurance model delivered 3x interview opportunities per enrolled student with zero unverified offer letters.\n\nI would be delighted to share our Institutional Placement Evidence demo with your team.',
            channel: 'EMAIL',
          },
        ],
      },
    },
  })

  const employerSeq = await prisma.outreachSequence.upsert({
    where: { id: 'seq-employer-liquidity-v1' },
    update: {},
    create: {
      id: 'seq-employer-liquidity-v1',
      name: 'Fresher Liquidity & Pre-Assessed Candidate Sourcing',
      targetType: 'EMPLOYER',
      description: 'Pitches pre-screened fresher candidate pools for active corporate vacancies.',
      isActive: true,
      steps: {
        create: [
          {
            stepNumber: 1,
            delayDays: 0,
            templateSubject: 'Pre-assessed fresher candidates for {{prospectName}}\'s hiring drive',
            templateBody: 'Dear {{contactName}},\n\nWe noted {{prospectName}}\'s active fresher recruitment drive across Delhi NCR. PlacementConnect currently has {{candidateCount}} pre-screened, 9-dimension assessed candidates matching your technical and sales specifications.\n\nAll candidates have verified transcripts and demonstrated employability benchmarks.\n\nWould you like our team to schedule a curated mega-drive slot with 20 pre-evaluated applicants this month?',
            channel: 'EMAIL',
          },
        ],
      },
    },
  })

  // 4. Outreach Drafts
  await prisma.growthOutreach.upsert({
    where: { id: 'outreach-draft-1' },
    update: {},
    create: {
      id: 'outreach-draft-1',
      prospectType: 'EMPLOYER',
      employerProspectId: emp1.id,
      subject: `Pre-assessed fresher candidates for ${emp1.companyName}'s hiring drive`,
      body: `Dear ${emp1.recruiterName},\n\nWe noted ${emp1.companyName}'s active fresher recruitment drive for Inside Sales and Customer Success. PlacementConnect currently has 183 pre-screened, 9-dimension assessed candidates in Delhi NCR matching your exact hiring criteria.\n\nWould you like our team to share a curated shortlist of 20 pre-evaluated applicants this month?`,
      status: 'DRAFT_PENDING_APPROVAL',
      isSafeAction: true,
    },
  })

  await prisma.growthOutreach.upsert({
    where: { id: 'outreach-draft-2' },
    update: {},
    create: {
      id: 'outreach-draft-2',
      prospectType: 'COLLEGE',
      collegeProspectId: college1.id,
      subject: `Extending placement outcomes for ${college1.name} (820 graduating cohort)`,
      body: `Dear ${college1.tpoName},\n\nWe noticed ${college1.name} has a prominent graduating class of approximately 820 students across technical and business disciplines.\n\nPlacementConnect extends TPO operations by bringing an additional pre-vetted corporate employer network and an automated NAAC/NIRF audit gap tracker.\n\nWould you be open for a brief 15-minute call this Thursday?`,
      status: 'DRAFT_PENDING_APPROVAL',
      isSafeAction: true,
    },
  })

  // 5. Growth Actions (AI Action Queue)
  await prisma.growthAction.upsert({
    where: { id: 'action-capacity-ncr-1' },
    update: {},
    create: {
      id: 'action-capacity-ncr-1',
      priority: 'URGENT_RED',
      category: 'ACQUIRE_EMPLOYERS',
      title: 'Acquire 3 Corporate Employers in Delhi NCR (320 Slot Capacity Deficit)',
      description: 'Delhi NCR active assurance obligation has a remaining gap of 320 interview slots across Inside Sales and Tech Support. Activating outreach to Fintech Horizon India and CloudScale Systems closes 76% of the deficit.',
      targetRegion: 'Delhi NCR',
      targetDomain: 'Inside Sales & Cloud Support',
      metricDeficit: 320,
      impactScore: 95.0,
      urgencyScore: 95.0,
      confidenceScore: 90.0,
      effortScore: 35.0,
      actionScore: 231.4,
      isSafeAction: true,
      reasoning: {
        coverageRatio: '66.7%',
        regionalGapSlots: 320,
        targetRegion: 'Delhi NCR',
        topUnmetRoles: ['Inside Sales Associate (180)', 'Customer Success (80)', 'Cloud Support (60)'],
        estimatedAddressableCapacity: 240,
        confidenceScore: '90%',
        impactExplanation: 'Acquiring these 2 pre-qualified employers delivers up to 240 interview slots, resolving 75% of the Delhi NCR assurance gap.',
      },
      status: 'PENDING',
    },
  })

  await prisma.growthAction.upsert({
    where: { id: 'action-college-ncr-2' },
    update: {},
    create: {
      id: 'action-college-ncr-2',
      priority: 'HIGH_ORANGE',
      category: 'ACQUIRE_COLLEGES',
      title: 'Enroll 4 Tier-2 BCA/B.Com Colleges in Delhi NCR for Active Recruiter Demand',
      description: 'Corporate partners in Delhi NCR have 140 open Inside Sales and Ops positions with insufficient student applicants. Target ABC Institute and Delhi Metropolitan College.',
      targetRegion: 'Delhi NCR',
      targetDomain: 'BCA & B.Com Cohorts',
      metricDeficit: 140,
      impactScore: 85.0,
      urgencyScore: 85.0,
      confidenceScore: 90.0,
      effortScore: 40.0,
      actionScore: 162.6,
      isSafeAction: true,
      reasoning: {
        coverageRatio: '82.0%',
        regionalGapSlots: 140,
        targetRegion: 'Delhi NCR',
        topUnmetRoles: ['Inside Sales', 'Operations'],
        estimatedAddressableCapacity: 200,
        confidenceScore: '90%',
        impactExplanation: 'Enrolling these 2 high-ICP colleges adds 1,460 eligible students to absorb open corporate requisitions.',
      },
      status: 'PENDING',
    },
  })

  await prisma.growthAction.upsert({
    where: { id: 'action-followup-skyline-3' },
    update: {},
    create: {
      id: 'action-followup-skyline-3',
      priority: 'HIGH_ORANGE',
      category: 'FOLLOW_UP_PROPOSALS',
      title: 'Follow up with ABC Institute on Pending MoU Review',
      description: 'Proposal viewed 4 days ago by Dr. Rakesh Verma (TPO). No response received yet.',
      targetRegion: 'Delhi NCR',
      targetDomain: 'Partnership Finalization',
      metricDeficit: 1,
      impactScore: 75.0,
      urgencyScore: 70.0,
      confidenceScore: 95.0,
      effortScore: 20.0,
      actionScore: 249.4,
      isSafeAction: true,
      reasoning: {
        coverageRatio: '100%',
        regionalGapSlots: 0,
        targetRegion: 'Delhi NCR',
        topUnmetRoles: ['MoU Onboarding'],
        estimatedAddressableCapacity: 820,
        confidenceScore: '95%',
        impactExplanation: 'Securing this partnership brings 820 graduating students into the verified placement network.',
      },
      status: 'PENDING',
    },
  })

  await prisma.growthAction.upsert({
    where: { id: 'action-stale-pune-4' },
    update: {},
    create: {
      id: 'action-stale-pune-4',
      priority: 'LOW_GREEN',
      category: 'RESOLVE_STALE_PROSPECTS',
      title: 'Refresh Contact Verification for 2 Pune Prospects Nearing Stale Status',
      description: 'Maharashtra Academy of Engineering profile has not been re-verified in 28 days. Pre-flight check will block outreach in 2 days.',
      targetRegion: 'Pune',
      targetDomain: 'Data Hygiene',
      metricDeficit: 2,
      impactScore: 50.0,
      urgencyScore: 40.0,
      confidenceScore: 85.0,
      effortScore: 20.0,
      actionScore: 85.0,
      isSafeAction: true,
      reasoning: {
        coverageRatio: '100%',
        regionalGapSlots: 0,
        targetRegion: 'Pune',
        topUnmetRoles: ['Data Freshness'],
        estimatedAddressableCapacity: 0,
        confidenceScore: '85%',
        impactExplanation: 'Maintains enterprise data provenance and prevents outreach suspension under DPDP safety policy.',
      },
      status: 'PENDING',
    },
  })

  console.log('✅ PlacementConnect seed completed successfully!')
  console.log('--------------------------------------------------')
  console.log('Credentials Summary:')
  console.log('  Super Admin:      admin@placementconnect.com / AdminPassword123!')
  console.log('  Operations:       ops@placementconnect.com   / Password123!')
  console.log('  Institution TPO:  tpo@apextech.edu.in        / Password123!')
  console.log('  Employer:         recruiter@techcorp.example.com / Password123!')
  console.log('  Student:          aarav.sharma@apextech.edu.in   / Password123!')
  console.log('--------------------------------------------------')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
