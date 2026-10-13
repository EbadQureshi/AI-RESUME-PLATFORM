'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpDown, ClipboardList, Download, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { useAdminApplications, useJobs } from '@/lib/hooks'
import { formatDate, toPct } from '@/lib/format'
import { APPLICATION_STATUSES, type AdminApplication, type ApplicationStatus } from '@/lib/api/types'
import { CompanyAvatar, EmptyState, ErrorBox, PageHeader, ScoreRing, StatusBadge } from '@/components/shared/display'
import { Btn, Input, Skeleton } from '@/components/shared/ui-kit'
import { Modal } from '@/components/shared/modal'
import { AnalysisPanel } from '@/components/applications/analysis-panel'
import { cn } from '@/lib/utils'

const selectClass =
  'h-10 rounded-xl border border-border bg-[#17152b] px-3 text-sm font-medium text-white shadow-sm outline-none transition-colors hover:bg-[#211e3d] focus-visible:ring-2 focus-visible:ring-primary [&>option]:bg-[#17152b] [&>option]:text-white'

export default function AdminApplicationsPage() {
  const { data: apps, error, isLoading, mutate } = useAdminApplications()
  const { data: jobs } = useJobs()
  const jobMap = useMemo(() => new Map(jobs?.map((j) => [j.id, j])), [jobs])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all')
  const [jobId, setJobId] = useState<string>('all')
  const [sort, setSort] = useState<'recent' | 'score'>('recent')
  const [viewing, setViewing] = useState<AdminApplication | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  const jobIds = useMemo(() => [...new Set(apps?.map((a) => a.job_id))], [apps])

  const list = useMemo(() => {
    const rows = (apps ?? []).filter(
      (a) =>
        (status === 'all' || a.status === status) &&
        (jobId === 'all' || a.job_id === Number(jobId)) &&
        `${a.candidate_email} ${a.resume_filename}`.toLowerCase().includes(q.toLowerCase()),
    )
    return rows.sort((a, b) =>
      sort === 'score' ? (b.match_score ?? -1) - (a.match_score ?? -1) : b.created_at.localeCompare(a.created_at),
    )
  }, [apps, status, jobId, q, sort])

  const changeStatus = async (app: AdminApplication, next: ApplicationStatus) => {
    setUpdating(app.id)
    try {
      const updated = await api.applications.updateStatus(app.id, next)
      await mutate(apps?.map((a) => (a.id === app.id ? { ...a, ...updated } : a)), { revalidate: false })
      toast.success(`Marked as ${next}`, { description: app.candidate_email })
    } catch (err) {
      toast.error('Status update failed', { description: errorMessage(err) })
    } finally {
      setUpdating(null)
    }
  }

  const download = async (app: AdminApplication) => {
    try {
      await api.admin.downloadResume(app.id, app.resume_filename)
    } catch (err) {
      toast.error('Download failed', { description: errorMessage(err) })
    }
  }

  return (
    <>
      <PageHeader icon={ClipboardList} title="Applications" description="Review candidates, download resumes and move them through your pipeline." />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="app-search" className="sr-only">Search candidates</label>
          <Input id="app-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email or file…" className="pl-9" />
        </div>
        <label className="sr-only" htmlFor="filter-status">Filter status</label>
        <select id="filter-status" className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus | 'all')}>
          <option value="all">All statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <label className="sr-only" htmlFor="filter-job">Filter job</label>
        <select id="filter-job" className={selectClass} value={jobId} onChange={(e) => setJobId(e.target.value)}>
          <option value="all">All jobs</option>
          {jobIds.map((id) => <option key={id} value={id}>{jobMap.get(id)?.title ?? `Job #${id}`}</option>)}
        </select>
        <Btn variant="outline" onClick={() => setSort((s) => (s === 'recent' ? 'score' : 'recent'))}>
          <ArrowUpDown aria-hidden="true" /> {sort === 'recent' ? 'Most recent' : 'Highest match'}
        </Btn>
      </div>

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications" description="Nothing matches your current filters." />
      ) : (
        <div className="glass overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-border bg-secondary/30 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Candidate</th>
                  <th scope="col" className="px-4 py-3 font-medium">Job</th>
                  <th scope="col" className="px-4 py-3 font-medium">Applied</th>
                  <th scope="col" className="px-4 py-3 font-medium">Job match</th>
                  <th scope="col" className="px-4 py-3 font-medium">ATS</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="transition-colors hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CompanyAvatar name={a.candidate_email} className="size-9 text-xs" />
                        <div className="min-w-0">
                          <p className="max-w-56 truncate font-medium">{a.candidate_name || a.candidate_email}</p>
                          <p className="max-w-56 truncate text-xs text-muted-foreground">{a.resume_filename}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-48 truncate">{jobMap.get(a.job_id)?.title ?? `Job #${a.job_id}`}</p>
                      <p className="text-xs text-muted-foreground">{jobMap.get(a.job_id)?.company ?? 'Closed'}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(a.created_at)}</td>
                    <td className="px-4 py-3"><ScoreRing value={toPct(a.match_score)} size={40} /></td>
                    <td className="px-4 py-3"><ScoreRing value={a.ats_score ?? a.analysis?.ats_score ?? 0} size={40} /></td>
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`status-${a.id}`}>Status for {a.candidate_email}</label>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={a.status} />
                        <select
                          id={`status-${a.id}`}
                          value={a.status}
                          disabled={updating === a.id}
                          onChange={(e) => changeStatus(a, e.target.value as ApplicationStatus)}
                          className={cn(selectClass, 'h-8 rounded-lg text-xs', updating === a.id && 'animate-pulse')}
                        >
                          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Btn size="icon" variant="ghost" onClick={() => setViewing(a)} aria-label="View analysis" disabled={!a.analysis}>
                          <Eye className="size-4" />
                        </Btn>
                        <Btn size="icon" variant="ghost" onClick={() => download(a)} aria-label="Download resume">
                          <Download className="size-4" />
                        </Btn>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.candidate_email ?? ''}
        description={viewing ? `${jobMap.get(viewing.job_id)?.title ?? `Job #${viewing.job_id}`} · AI analysis` : ''}
        className="max-w-3xl"
      >
        {viewing?.analysis && <AnalysisPanel analysis={viewing.analysis} />}
      </Modal>
    </>
  )
}
