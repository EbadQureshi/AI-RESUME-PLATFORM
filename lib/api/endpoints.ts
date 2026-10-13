import { apiRequest, getApiBaseUrl } from './client'
import type {
  AdminApplication,
  Analytics,
  Application,
  ApplicationStatus,
  CompetitionCandidate,
  InterviewSession,
  Job,
  JobInput,
  LearningSession,
  Resume,
  TokenResponse,
  TopMatch,
  User,
} from './types'

const V1 = '/api/v1'

function page(limit = 100, offset = 0) {
  return `limit=${limit}&offset=${offset}`
}

export const api = {
  health: () => apiRequest<{ status: string }>('/health', { auth: false }),

  auth: {
    register: (email: string, password: string, full_name?: string) =>
      apiRequest<User>(`${V1}/auth/register`, {
        method: 'POST',
        body: { email, password, full_name },
        auth: false,
      }),
    login: (email: string, password: string) =>
      apiRequest<TokenResponse>(`${V1}/auth/login`, {
        method: 'POST',
        body: { email, password },
        auth: false,
      }),
    me: () => apiRequest<User>(`${V1}/auth/me`),
  },

  jobs: {
    list: (limit?: number, offset?: number) =>
      apiRequest<Job[]>(`${V1}/jobs/?${page(limit, offset)}`, { auth: false }),
    get: (id: number) => apiRequest<Job>(`${V1}/jobs/${id}`, { auth: false }),
    create: (input: JobInput) => apiRequest<Job>(`${V1}/jobs/`, { method: 'POST', body: input }),
    update: (id: number, input: Partial<JobInput>) =>
      apiRequest<Job>(`${V1}/jobs/${id}`, { method: 'PATCH', body: input }),
    close: (id: number) => apiRequest<Job>(`${V1}/jobs/${id}/close`, { method: 'POST' }),
    remove: (id: number) => apiRequest<void>(`${V1}/jobs/${id}`, { method: 'DELETE' }),
  },

  resumes: {
    upload: (file: File) => {
      const form = new FormData()
      form.append('file', file)
      return apiRequest<Resume>(`${V1}/resumes/`, { method: 'POST', body: form })
    },
    list: (limit?: number, offset?: number) =>
      apiRequest<Resume[]>(`${V1}/resumes/?${page(limit, offset)}`),
  },

  applications: {
    apply: (job_id: number, resume_id: number) =>
      apiRequest<Application>(`${V1}/applications/`, {
        method: 'POST',
        body: { job_id, resume_id },
      }),
    mine: (limit?: number, offset?: number) =>
      apiRequest<Application[]>(`${V1}/applications/me?${page(limit, offset)}`),
    analyze: (id: number) =>
      apiRequest<Application>(`${V1}/applications/${id}/analyze`, { method: 'POST' }),
    downloadRevisedResume: async (id: number, filename: string) => {
      const res = await apiRequest<Response>(`${V1}/applications/${id}/resume/revised`, { method: 'POST', raw: true })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `tailored-resume-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
    updateStatus: (id: number, status: ApplicationStatus) =>
      apiRequest<Application>(`${V1}/applications/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
  },

  interviews: {
    start: (application_id: number, question_count = 15) =>
      apiRequest<InterviewSession>(`${V1}/interviews/`, {
        method: 'POST',
        body: { application_id, question_count },
      }),
    get: (id: number) => apiRequest<InterviewSession>(`${V1}/interviews/${id}`),
    answer: (id: number, answer: string) =>
      apiRequest<InterviewSession>(`${V1}/interviews/${id}/answer`, {
        method: 'POST',
        body: { answer },
      }),
  },

  learning: {
    start: (application_id: number) =>
      apiRequest<LearningSession>(`${V1}/learning/`, {
        method: 'POST',
        body: { application_id },
      }),
    get: (id: number) => apiRequest<LearningSession>(`${V1}/learning/${id}`),
    answer: (id: number, answer: string) =>
      apiRequest<LearningSession>(`${V1}/learning/${id}/answer`, {
        method: 'POST',
        body: { answer },
      }),
  },

  admin: {
    applications: (limit?: number, offset?: number) =>
      apiRequest<AdminApplication[]>(`${V1}/admin/applications?${page(limit, offset)}`),
    downloadResume: async (id: number, filename: string) => {
      const res = await apiRequest<Response>(`${V1}/admin/applications/${id}/resume`, {
        raw: true,
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `application-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
    analytics: () => apiRequest<Analytics>(`${V1}/admin/analytics`),
    topMatches: (jobId: number) =>
      apiRequest<TopMatch[]>(`${V1}/admin/jobs/${jobId}/top-matches`),
    competition: (jobId: number) =>
      apiRequest<CompetitionCandidate[]>(`${V1}/admin/jobs/${jobId}/competition`),
  },

  docsUrl: () => `${getApiBaseUrl()}/docs`,
}
