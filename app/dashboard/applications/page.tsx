'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { useJobs, useMyApplications } from '@/lib/hooks'
import { errorMessage } from '@/lib/api/client'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { EmptyState, ErrorBox, PageHeader } from '@/components/shared/display'
import { btnClass, Skeleton } from '@/components/shared/ui-kit'
import { ApplicationRow } from '@/components/applications/application-row'

export default function ApplicationsPage() {
  const { data: apps, error, isLoading, mutate } = useMyApplications()
  const { data: jobs } = useJobs()
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const jobMap = useMemo(() => new Map(jobs?.map((j) => [j.id, j])), [jobs])

  const list = useMemo(
    () =>
      [...(apps ?? [])]
        .filter((a) => filter === 'all' || a.status === filter)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [apps, filter],
  )

  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title="Applications"
        description="Track status and open any application to run AI analysis."
        actions={<Link href="/dashboard/jobs" className={btnClass('primary', 'md')}>Apply to a job</Link>}
      />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {(['all', ...APPLICATION_STATUSES] as const).map((s) => {
          const count = s === 'all' ? apps?.length ?? 0 : apps?.filter((a) => a.status === s).length ?? 0
          return (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors',
                filter === s ? 'border-primary/50 bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {s} <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing here yet"
          description={filter === 'all' ? 'Apply to a role to see it here.' : `No applications with status "${filter}".`}
          action={<Link href="/dashboard/jobs" className={btnClass('primary', 'md')}>Browse jobs</Link>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((a, i) => <ApplicationRow key={a.id} app={a} job={jobMap.get(a.job_id)} index={i} />)}
        </div>
      )}
    </>
  )
}
