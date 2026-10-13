'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, BrainCircuit, Download, GraduationCap, MapPin, MessagesSquare, RefreshCw, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useJob, useMyApplications } from '@/lib/hooks'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { formatDate, toPct } from '@/lib/format'
import { CompanyAvatar, EmptyState, ErrorBox, ScoreRing, StatusBadge } from '@/components/shared/display'
import { Btn, btnClass, Card, Skeleton } from '@/components/shared/ui-kit'
import { AnalysisPanel } from '@/components/applications/analysis-panel'
import { SessionLauncher } from '@/components/sessions/session-launcher'

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const { data: apps, error, isLoading, mutate } = useMyApplications()
  const app = apps?.find((a) => a.id === id)
  const { data: job } = useJob(app?.job_id ?? null)
  const [analyzing, setAnalyzing] = useState(false)
  const [rewriting, setRewriting] = useState(false)

  const downloadRevised = async () => {
    setRewriting(true)
    try {
      await api.applications.downloadRevisedResume(id, `tailored-resume-job-${app?.job_id ?? id}.pdf`)
      toast.success('Tailored resume PDF generated')
    } catch (err) {
      toast.error('Could not generate resume PDF', { description: errorMessage(err) })
    } finally { setRewriting(false) }
  }

  const analyze = async () => {
    setAnalyzing(true)
    try {
      const updated = await api.applications.analyze(id)
      await mutate(apps?.map((a) => (a.id === id ? updated : a)), { revalidate: true })
      toast.success('Analysis complete')
    } catch (err) {
      toast.error('Analysis failed', { description: errorMessage(err) })
    } finally {
      setAnalyzing(false)
    }
  }

  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
  if (isLoading) return <div className="flex flex-col gap-4"><Skeleton className="h-40" /><Skeleton className="h-64" /></div>
  if (!app)
    return (
      <EmptyState
        icon={BrainCircuit}
        title="Application not found"
        description="It may belong to another account."
        action={<Link href="/dashboard/applications" className={btnClass('primary')}>Back to applications</Link>}
      />
    )

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard/applications" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> All applications
      </Link>

      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <CompanyAvatar name={job?.company ?? 'Job'} className="size-16 text-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-balance">{job?.title ?? `Job #${app.job_id}`}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{job?.company}</span>
              {job?.location && (
                <span className="flex items-center gap-1"><MapPin className="size-3.5" aria-hidden="true" />{job.location}</span>
              )}
              <span>Applied {formatDate(app.created_at)}</span>
              <span>Resume #{app.resume_id}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center"><ScoreRing value={toPct(app.match_score)} size={84} label="job match" /><p className="mt-1 text-xs text-muted-foreground">Job fit</p></div>
            <div className="text-center"><ScoreRing value={app.ats_score ?? app.analysis?.ats_score ?? 0} size={84} label="ATS" /><p className="mt-1 text-xs text-muted-foreground">ATS readiness</p></div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          icon={MessagesSquare}
          title="Mock interview"
          body="Choose how many AI interview questions to practice, with instant feedback on every answer."
        >
          <SessionLauncher kind="interview" applicationId={app.id} />
        </ActionCard>
        <ActionCard
          icon={GraduationCap}
          title="Learning plan"
          body="A personalized roadmap and up to 10 coaching questions to close your gaps."
        >
          <SessionLauncher kind="learning" applicationId={app.id} />
        </ActionCard>
      </div>

      <section aria-labelledby="analysis-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="analysis-title" className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-5 text-primary" aria-hidden="true" /> AI resume analysis
          </h2>
          {app.analysis && (
            <Btn variant="outline" size="sm" onClick={analyze} loading={analyzing}>
              {!analyzing && <RefreshCw aria-hidden="true" />} Re-run
            </Btn>
          )}
        </div>
        {app.analysis ? (
          <AnalysisPanel analysis={app.analysis} />
        ) : (
          <Card className="relative flex flex-col items-center overflow-hidden py-14 text-center">
            {analyzing && (
              <div className="absolute inset-x-0 top-0 h-0.5 animate-scan bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden="true" />
            )}
            <motion.span
              animate={analyzing ? { rotate: 360 } : { rotate: 0 }}
              transition={analyzing ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}
              className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-primary"
            >
              <BrainCircuit className="size-8" aria-hidden="true" />
            </motion.span>
            <h3 className="mt-5 text-lg font-semibold">{analyzing ? 'Analyzing your resume…' : 'Not analyzed yet'}</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Compare your resume with the job to get job-match and ATS-readiness scores, keyword gaps, and concrete edit suggestions.
            </p>
            <Btn className="mt-6" size="lg" onClick={analyze} loading={analyzing}>
              {!analyzing && <Sparkles aria-hidden="true" />} Run AI analysis
            </Btn>
          </Card>
        )}
      </section>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: typeof MessagesSquare
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
      {children}
    </Card>
  )
}
