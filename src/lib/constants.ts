// Application-wide constants - NOT hardcoded business values
// Business values like prices, interview targets etc. come from database Settings

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PlacementConnect'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'] as const

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Auth
export const BCRYPT_SALT_ROUNDS = 12
export const MAX_LOGIN_ATTEMPTS = 10
export const LOCKOUT_DURATION_MINUTES = 30
export const VERIFICATION_TOKEN_EXPIRY_HOURS = 24
export const RESET_TOKEN_EXPIRY_HOURS = 1

// Rate limiting
export const RATE_LIMIT_LOGIN = { windowMs: 15 * 60 * 1000, max: 5 } // 5 per 15min
export const RATE_LIMIT_API = { windowMs: 60 * 1000, max: 100 } // 100 per minute

// Verification IDs
export const STUDENT_ID_PREFIX = 'STU'
export const PLACEMENT_ID_PREFIX = 'PLC'
export const INVOICE_ID_PREFIX = 'INV'

// Assessment categories
export const ASSESSMENT_CATEGORIES = [
  'SKILLS',
  'WORK_ETHICS',
  'WORKPLACE_PREFERENCES',
  'COMMUNICATION',
  'LEARNING_AGILITY',
  'TEAM_BEHAVIOUR',
  'CAREER_MOTIVATION',
  'PROBLEM_SOLVING',
  'PROFESSIONAL_BEHAVIOUR',
] as const

// Badge types
export const BADGE_TYPES = [
  'INTERVIEW_READY',
  'EMPLOYER_READY',
  'STRONG_COMMUNICATOR',
  'HIGH_LEARNING_AGILITY',
  'TEAM_PLAYER',
  'TECHNICAL_READY',
  'SALES_READY',
  'CUSTOMER_SUCCESS_READY',
  'HIGH_PROFESSIONALISM',
] as const
