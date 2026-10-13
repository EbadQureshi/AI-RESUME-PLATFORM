'use client'

import useSWR from 'swr'
import { api } from './api/endpoints'
import { useAuth } from './auth-context'

export function useJobs() {
  return useSWR('jobs', () => api.jobs.list(100, 0))
}

export function useJob(id: number | null) {
  return useSWR(id ? ['job', id] : null, () => api.jobs.get(id as number))
}

export function useResumes() {
  const { token } = useAuth()
  return useSWR(token ? ['resumes', token] : null, () => api.resumes.list(100, 0))
}

export function useMyApplications() {
  const { token } = useAuth()
  return useSWR(token ? ['applications', token] : null, () => api.applications.mine(100, 0))
}

export function useAdminApplications() {
  const { token, user } = useAuth()
  return useSWR(token && user?.role === 'admin' ? ['admin-applications', token] : null, () =>
    api.admin.applications(100, 0),
  )
}

export function useAnalytics() {
  const { token, user } = useAuth()
  return useSWR(token && user?.role === 'admin' ? ['analytics', token] : null, () =>
    api.admin.analytics(),
  )
}

export function useHealth() {
  return useSWR('health', () => api.health(), {
    refreshInterval: 30000,
    shouldRetryOnError: false,
  })
}
