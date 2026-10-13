'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  GraduationCap,
  MessagesSquare,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useJobs, useMyApplications, useResumes } from '@/lib/hooks'
import { toPct } from '@/lib/format'
import { StatCard } from '@/components/shared/display'
import { Card } from '@/components/shared/ui-kit'
import { ApplicationRow } from '@/components/applications/application-row'

export default function SeekerOverview() {
  const { user } = useAuth()
  const { data: resumes } = useResumes()
  const { data: apps } = useMyApplications()
  const { data: jobs } = useJobs()

  const stats = useMemo(() => {
    const analyzed = apps?.filter((a) => a.analysis) ?? []
    const scored = apps?.filter((a) => a.match_score !== null) ?? []
    const avg = scored.length
      ? Math.round(scored.reduce((s, a) => s + (toPct(a.match_score) ?? 0), 0) / scored.length)
      : null
    return { analyzed: analyzed.length, avg }
  }, [apps])

  const jobMap = useMemo(() => new Map(jobs?.map((j) => [j.id, j])), [jobs])
  const recent = [...(apps ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 4)
  const name = user?.email.split('@')[0] ?? ''

  const actions = [
    { href: '/dashboard/resumes', icon: Upload, title: 'Upload a resume', body: 'PDF, scanned or text-based' },
    { href: '/dashboard/jobs', icon: BriefcaseBusiness, title: 'Browse open roles', body: `${jobs?.length ?? 0} jobs open now` },
    { href: '/dashboard/interviews', icon: MessagesSquare, title: 'Practice interview', body: 'AI questions for your role' },
    { href: '/dashboard/learning', icon: GraduationCap, title: 'Learning plan', body: 'Close your skill gaps' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-accent/10 p-6 md:p-8"
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative">
          <p className="flex items-center gap-2 text-sm text-primary">
            <Sparkles className="size-4" aria-hidden="true" /> Welcome back
          </p>
          <h1 className="mt-2 text-2xl font-bold capitalize md:text-3xl">Hi, {name}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {apps?.length
              ? 'Keep momentum — analyze new applications and rehearse for interviews.'
              : 'Upload a resume and apply to your first role to get an AI match analysis.'}
          </p>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Resumes" value={resumes?.length ?? 0} icon={FileText} tone="primary" />
        <StatCard label="Applications" value={apps?.length ?? 0} icon={ClipboardList} tone="accent" delay={0.05} />
        <StatCard label="Analyzed" value={stats.analyzed} icon={Sparkles} tone="warning" delay={0.1} />
        <StatCard label="Avg. match" value={stats.avg === null ? '—' : `${stats.avg}%`} icon={Target} tone="success" delay={0.15} />
      </div>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a, i) => (
            <motion.div key={a.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <Link
                href={a.href}
                className="glass group flex h-full flex-col gap-3 rounded-2xl border border-border p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-110">
                  <a.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.body}</p>
                </div>
                <ArrowRight className="mt-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-apps">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-apps" className="text-lg font-semibold">Recent applications</h2>
          <Link href="/dashboard/applications" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {recent.length ? (
          <div className="flex flex-col gap-3">
            {recent.map((a, i) => (
              <ApplicationRow key={a.id} app={a} job={jobMap.get(a.job_id)} index={i} />
            ))}
          </div>
        ) : (
          <Card className="text-center text-sm text-muted-foreground">No applications yet.</Card>
        )}
      </section>
    </div>
  )
}
