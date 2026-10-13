'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'motion/react'
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FolderLock,
  FolderOpen,
  MessagesSquare,
  Plus,
} from 'lucide-react'
import { useAdminApplications, useAnalytics, useJobs } from '@/lib/hooks'
import { errorMessage } from '@/lib/api/client'
import { timeAgo, toPct } from '@/lib/format'
import { CompanyAvatar, ErrorBox, PageHeader, ScoreRing, StatCard, StatusBadge } from '@/components/shared/display'
import { btnClass, Card, Skeleton } from '@/components/shared/ui-kit'
import { FunnelChart, JobsDonut, StatusBars } from '@/components/admin/charts'

export default function AdminAnalyticsPage() {
  const { data, error, isLoading, mutate } = useAnalytics()
  const { data: apps } = useAdminApplications()
  const { data: jobs } = useJobs()
  const jobMap = useMemo(() => new Map(jobs?.map((j) => [j.id, j])), [jobs])
  const recent = [...(apps ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6)

  return (
    <>
      <PageHeader
        icon={BarChart3}
        title="Hiring analytics"
        description="Live overview of roles, applicants and outcomes."
        actions={
          <Link href="/admin/jobs?new=1" className={btnClass('primary')}>
            <Plus aria-hidden="true" /> Post a job
          </Link>
        }
      />

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Jobs posted" value={data.jobs_inserted} icon={BriefcaseBusiness} tone="primary" />
            <StatCard label="Open jobs" value={data.open_jobs} icon={FolderOpen} tone="accent" delay={0.05} />
            <StatCard label="Closed jobs" value={data.closed_jobs} icon={FolderLock} tone="warning" delay={0.1} />
            <StatCard label="Applications" value={data.total_applications} icon={ClipboardList} tone="primary" delay={0.15} />
            <StatCard label="Interviewed" value={data.interviewed_candidates} icon={MessagesSquare} tone="accent" delay={0.2} />
            <StatCard label="Selected" value={data.selected_candidates} icon={CheckCircle2} tone="success" delay={0.25} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard title="Candidate funnel" className="lg:col-span-2">
              <FunnelChart analytics={data} />
            </ChartCard>
            <ChartCard title="Jobs">
              <JobsDonut open={data.open_jobs} closed={data.closed_jobs} />
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <ChartCard title="Applications by status" className="lg:col-span-2">
              <StatusBars applications={apps ?? []} />
            </ChartCard>
            <Card className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Latest applicants</h2>
                <Link href="/admin/applications" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              {recent.length ? (
                <ul className="flex flex-col divide-y divide-border">
                  {recent.map((a, i) => (
                    <motion.li
                      key={a.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 py-3"
                    >
                      <CompanyAvatar name={a.candidate_email} className="size-9 text-xs" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.candidate_email}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {jobMap.get(a.job_id)?.title ?? `Job #${a.job_id}`} · {timeAgo(a.created_at)}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                      <ScoreRing value={toPct(a.match_score)} size={40} />
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No applications yet.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

function ChartCard({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <Card className={className}>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </Card>
  )
}
