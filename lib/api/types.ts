export type Role = 'admin' | 'job_applier'

export interface User {
  id: number
  email: string
  full_name: string | null
  role: Role
  is_active: boolean
}

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
}

export type JobStatus = 'open' | 'closed'

export interface Job {
  id: number
  title: string
  company: string
  location: string | null
  description: string
  requirements: string | null
  status: JobStatus
  created_at: string
  closed_at: string | null
}

export interface JobInput {
  title: string
  company: string
  location?: string | null
  description: string
  requirements?: string | null
}

export interface Resume {
  id: number
  original_filename: string
  extracted_text: string
  extraction_method: string
}

export const APPLICATION_STATUSES = [
  'received',
  'reviewing',
  'interviewed',
  'selected',
  'rejected',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export interface Analysis {
  ats_score: number
  fit_summary: string
  job_keywords: string[]
  matched_keywords: string[]
  missing_keywords: string[]
  suggested_additions: string[]
  suggested_removals: string[]
}

export interface Application {
  id: number
  user_id: number
  job_id: number
  resume_id: number
  status: ApplicationStatus
  match_score: number | null
  ats_score: number | null
  analysis: Analysis | null
  created_at: string
}

export interface AdminApplication extends Application {
  candidate_email: string
  candidate_name: string
  resume_filename: string
}

export type SessionStatus = 'in_progress' | 'completed'

export interface InterviewAnswer {
  question_number: number
  question: string
  answer: string
  is_correct: boolean | null
  feedback: string | null
}

export interface InterviewSession {
  id: number
  status: SessionStatus
  question_number: number | null
  question_count: number
  question: string | null
  answers: InterviewAnswer[]
  feedback: string | null
  completed_at: string | null
}

export interface LearningSession {
  id: number
  status: SessionStatus
  roadmap: string
  question_number: number | null
  question: string | null
  answer_feedback: string | null
  final_feedback: string | null
  completed_at: string | null
}

export interface Analytics {
  jobs_inserted: number
  open_jobs: number
  closed_jobs: number
  total_applications: number
  interviewed_candidates: number
  selected_candidates: number
}

export interface CompetitionCandidate {
  rank: number
  application_id: number
  user_id: number
  candidate_name: string
  candidate_email: string
  resume_id: number
  resume_filename: string
  score: number
  correct_answers: number
  total_questions: number
  stars: number
  completed_at: string | null
}

export interface TopMatch {
  application_id: number
  user_id: number
  resume_id: number
  score: number
}
