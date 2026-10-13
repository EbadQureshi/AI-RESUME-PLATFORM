'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'motion/react'
import { BriefcaseBusiness, Lock, MapPin, Pencil, Plus, Search, Trash2, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { useAdminApplications, useJobs } from '@/lib/hooks'
import { formatDate } from '@/lib/format'
import type { Job } from '@/lib/api/types'
import { CompanyAvatar, EmptyState, ErrorBox, PageHeader } from '@/components/shared/display'
import { Badge, Btn, Input, Skeleton } from '@/components/shared/ui-kit'
import { Modal } from '@/components/shared/modal'
import { JobFormModal } from '@/components/admin/job-form-modal'
import { TopMatchesModal } from '@/components/admin/top-matches-modal'
import { CompetitionModal } from '@/components/admin/competition-modal'
import { cn } from '@/lib/utils'

export default function AdminJobsPage() {
  return (
    <Suspense>
      <AdminJobs />
    </Suspense>
  )
}

function AdminJobs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: openJobs, error, isLoading, mutate } = useJobs()
  const { data: apps } = useAdminApplications()

  // The public list only returns open jobs; recover closed ones via applications.
  const closedIds = useMemo(() => {
    const open = new Set(openJobs?.map((j) => j.id))
    return [...new Set(apps?.map((a) => a.job_id))].filter((id) => !open.has(id)).sort()
  }, [openJobs, apps])
  const { data: closedJobs, mutate: mutateClosed } = useSWR(
    openJobs && closedIds.length ? ['closed-jobs', closedIds.join(',')] : null,
    () => Promise.all(closedIds.map((id) => api.jobs.get(id).catch(() => null))),
  )

  const [tab, setTab] = useState<'open' | 'closed'>('open')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<Job | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [matchesFor, setMatchesFor] = useState<Job | null>(null)
  const [competitionFor, setCompetitionFor] = useState<Job | null>(null)
  const [confirm, setConfirm] = useState<{ job: Job; action: 'close' | 'delete' } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (searchParams.get('new')) {
      setEditing(null)
      setFormOpen(true)
      router.replace('/admin/jobs')
    }
  }, [searchParams, router])

  const counts = useMemo(() => {
    const m = new Map<number, number>()
    apps?.forEach((a) => m.set(a.job_id, (m.get(a.job_id) ?? 0) + 1))
    return m
  }, [apps])

  const closed = (closedJobs ?? []).filter((j): j is Job => !!j && j.status === 'closed')
  const source = tab === 'open' ? openJobs ?? [] : closed
  const list = source.filter((j) => `${j.title} ${j.company} ${j.location ?? ''}`.toLowerCase().includes(q.toLowerCase()))

  const refresh = () => {
    mutate()
    mutateClosed()
  }

  const runConfirm = async () => {
    if (!confirm) return
    setBusy(true)
    try {
      if (confirm.action === 'close') await api.jobs.close(confirm.job.id)
      else await api.jobs.remove(confirm.job.id)
      toast.success(confirm.action === 'close' ? 'Job closed' : 'Job deleted')
      refresh()
      setConfirm(null)
    } catch (err) {
      toast.error('Action failed', { description: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        icon={BriefcaseBusiness}
        title="Job postings"
        description="Create, edit, close and rank applicants for each role."
        actions={
          <Btn onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus aria-hidden="true" /> New job
          </Btn>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-border bg-card/60 p-1" role="tablist">
          {(['open', 'closed'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn('relative rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors', tab === t ? 'text-foreground' : 'text-muted-foreground')}
            >
              {tab === t && <motion.span layoutId="job-tab" className="absolute inset-0 rounded-lg bg-secondary" />}
              <span className="relative">
                {t} <span className="opacity-60">{t === 'open' ? openJobs?.length ?? 0 : closed.length}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="job-search" className="sr-only">Search jobs</label>
          <Input id="job-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" className="pl-9" />
        </div>
      </div>

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={refresh} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={tab === 'open' ? 'No open jobs' : 'No closed jobs'}
          description={tab === 'open' ? 'Post a role to start receiving applications.' : 'Closed roles with applicants appear here.'}
        />
      ) : (
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {list.map((job, i) => (
              <motion.article
                key={job.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="glass group flex flex-col gap-4 rounded-2xl border border-border p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <CompanyAvatar name={job.company} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{job.title}</h3>
                    <p className="truncate text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge tone={job.status === 'open' ? 'success' : 'warning'} className="capitalize">{job.status}</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" aria-hidden="true" />{job.location}</span>}
                  <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden="true" />{counts.get(job.id) ?? 0} applicants</span>
                  <span>{job.status === 'closed' ? `Closed ${formatDate(job.closed_at)}` : `Posted ${formatDate(job.created_at)}`}</span>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                  <Btn size="sm" variant="secondary" onClick={() => setMatchesFor(job)}>
                    <Trophy aria-hidden="true" /> Top matches
                  </Btn>
                  <Btn size="sm" variant="outline" onClick={() => setCompetitionFor(job)}>
                    <Users aria-hidden="true" /> Interview ranking
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => { setEditing(job); setFormOpen(true) }} aria-label={`Edit ${job.title}`}>
                    <Pencil aria-hidden="true" />
                  </Btn>
                  {job.status === 'open' && (
                    <Btn size="sm" variant="ghost" onClick={() => setConfirm({ job, action: 'close' })} aria-label={`Close ${job.title}`}>
                      <Lock aria-hidden="true" />
                    </Btn>
                  )}
                  <Btn size="sm" variant="danger" className="ml-auto" onClick={() => setConfirm({ job, action: 'delete' })} aria-label={`Delete ${job.title}`}>
                    <Trash2 aria-hidden="true" />
                  </Btn>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <JobFormModal open={formOpen} job={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
      <TopMatchesModal job={matchesFor} onClose={() => setMatchesFor(null)} />
      <CompetitionModal job={competitionFor} onClose={() => setCompetitionFor(null)} />
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.action === 'close' ? 'Close this job?' : 'Delete this job?'}
        description={
          confirm?.action === 'close'
            ? 'It will stop accepting applications. Existing applications are kept.'
            : 'This permanently deletes the job and its applications.'
        }
      >
        <p className="mb-6 font-medium">{confirm?.job.title} · {confirm?.job.company}</p>
        <div className="flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant={confirm?.action === 'delete' ? 'danger' : 'primary'} loading={busy} onClick={runConfirm}>
            {confirm?.action === 'close' ? 'Close job' : 'Delete job'}
          </Btn>
        </div>
      </Modal>
    </>
  )
}
