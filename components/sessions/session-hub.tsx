'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ClipboardList, GraduationCap, MessagesSquare } from 'lucide-react'
import { useJobs, useMyApplications } from '@/lib/hooks'
import { errorMessage } from '@/lib/api/client'
import { CompanyAvatar, EmptyState, ErrorBox, PageHeader, ScoreRing } from '@/components/shared/display'
import { toPct } from '@/lib/format'
import { btnClass, Skeleton } from '@/components/shared/ui-kit'
import { SessionLauncher } from './session-launcher'

const copy = {
  interview: {
    title: 'Interview prep',
    description: 'Choose how many AI-generated questions to practice for each application.',
    icon: MessagesSquare,
    hero: 'Practice makes the offer.',
    heroBody: 'Answer at your own pace. When you finish, you get structured AI feedback on your answers.',
  },
  learning: {
    title: 'Learning plans',
    description: 'Get a personalized roadmap and coaching questions for each role you applied to.',
    icon: GraduationCap,
    hero: 'Turn gaps into strengths.',
    heroBody: 'Your plan is built from the keywords you are missing, with feedback after every answer.',
  },
}

export function SessionHub({ kind }: { kind: 'interview' | 'learning' }) {
  const { data: apps, error, isLoading, mutate } = useMyApplications()
  const { data: jobs } = useJobs()
  const jobMap = useMemo(() => new Map(jobs?.map((j) => [j.id, j])), [jobs])
  const c = copy[kind]

  return (
    <>
      <PageHeader icon={c.icon} title={c.title} description={c.description} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 grid overflow-hidden rounded-3xl border border-border bg-card/60 md:grid-cols-[1.2fr_1fr]"
      >
        <div className="relative z-10 flex flex-col justify-center p-6 md:p-8">
          <h2 className="text-2xl font-bold text-balance">{c.hero}</h2>
          <p className="mt-2 text-muted-foreground text-pretty">{c.heroBody}</p>
        </div>
        <div className="relative h-44 md:h-auto">
          <Image src="/images/interview-ai.png" alt="" fill className="animate-float object-cover opacity-90" sizes="(min-width: 768px) 40vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/40 to-transparent" aria-hidden="true" />
        </div>
      </motion.div>

      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : !apps?.length ? (
        <EmptyState
          icon={ClipboardList}
          title="Apply to a job first"
          description="Sessions are tailored to a specific application."
          action={<Link href="/dashboard/jobs" className={btnClass('primary')}>Browse jobs</Link>}
        />
      ) : (
        <>
        {kind === 'interview' && apps.length > 1 && (
          <div className="mb-4 rounded-2xl border border-primary/25 bg-primary/8 p-4">
            <h2 className="font-semibold">Which job would you like to prepare for?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Compare your CV match score for each application below, then start interview preparation for the role you choose.</p>
          </div>
        )}
        <ul className="flex flex-col gap-3">
          {apps.map((a, i) => {
            const job = jobMap.get(a.job_id)
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="glass flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <CompanyAvatar name={job?.company ?? 'Job'} />
                  <div className="min-w-0">
                    <Link href={`/dashboard/applications/${a.id}`} className="block truncate font-medium hover:text-primary">
                      {job?.title ?? `Job #${a.job_id}`}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">{job?.company ?? 'Closed role'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <ScoreRing value={toPct(a.match_score)} size={48} label="match" />
                    <p className="mt-1 text-[10px] text-muted-foreground">CV match</p>
                  </div>
                  <SessionLauncher kind={kind} applicationId={a.id} compact />
                </div>
              </motion.li>
            )
          })}
        </ul>
        </>
      )}
    </>
  )
}
