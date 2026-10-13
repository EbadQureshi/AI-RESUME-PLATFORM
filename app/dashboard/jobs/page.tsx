'use client'

import { useMemo } from 'react'
import { BriefcaseBusiness } from 'lucide-react'
import { useMyApplications } from '@/lib/hooks'
import { PageHeader } from '@/components/shared/display'
import { JobBrowser } from '@/components/jobs/job-browser'

export default function DashboardJobsPage() {
  const { data: apps } = useMyApplications()
  const applied = useMemo(() => new Set(apps?.map((a) => a.job_id)), [apps])

  return (
    <>
      <PageHeader
        icon={BriefcaseBusiness}
        title="Find jobs"
        description="Open a role to read the details and apply with one of your resumes."
      />
      <JobBrowser appliedJobIds={applied} />
    </>
  )
}
