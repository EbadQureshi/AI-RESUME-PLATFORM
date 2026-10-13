'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { BriefcaseBusiness, Clock, MapPin, Search } from 'lucide-react'
import { useJobs } from '@/lib/hooks'
import { errorMessage } from '@/lib/api/client'
import { timeAgo } from '@/lib/format'
import type { Job } from '@/lib/api/types'
import { CompanyAvatar, EmptyState, ErrorBox } from '@/components/shared/display'
import { Input, Skeleton } from '@/components/shared/ui-kit'
import { JobDetailModal } from './job-detail-modal'

export function JobBrowser({ appliedJobIds }: { appliedJobIds?: Set<number> }) {
  const { data: jobs, error, isLoading, mutate } = useJobs()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Job | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!jobs) return []
    if (!q) return jobs
    return jobs.filter((j) =>
      [j.title, j.company, j.location, j.description, j.requirements]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    )
  }, [jobs, query])

  return (
    <div>
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="job-search" className="sr-only">Search jobs</label>
        <Input
          id="job-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company, location or skill…"
          className="h-12 pl-11"
        />
      </div>

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={query ? 'No matching roles' : 'No open roles yet'}
          description={query ? 'Try a different keyword.' : 'Check back soon — new jobs are posted regularly.'}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {filtered.length} open {filtered.length === 1 ? 'role' : 'roles'}
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map((job, i) => (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
              >
                <JobCard job={job} applied={appliedJobIds?.has(job.id)} onOpen={() => setSelected(job)} />
              </motion.li>
            ))}
          </ul>
        </>
      )}

      <JobDetailModal
        job={selected}
        onClose={() => setSelected(null)}
        applied={selected ? appliedJobIds?.has(selected.id) : false}
      />
    </div>
  )
}

function JobCard({ job, applied, onOpen }: { job: Job; applied?: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="glass group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/20" aria-hidden="true" />
      <div className="relative flex items-start gap-4">
        <CompanyAvatar name={job.company} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-balance group-hover:text-primary">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        {applied && (
          <span className="rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
            Applied
          </span>
        )}
      </div>
      <p className="relative mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
      <div className="relative mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-muted-foreground">
        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {timeAgo(job.created_at)}
        </span>
      </div>
    </button>
  )
}
