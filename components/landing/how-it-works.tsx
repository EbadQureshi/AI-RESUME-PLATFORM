'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { BriefcaseBusiness, LayoutDashboard, Upload, Users, Wand2 } from 'lucide-react'
import { btnClass } from '@/components/shared/ui-kit'
import { SectionHeading } from './features'

const steps = [
  { icon: Upload, title: 'Upload your resume', body: 'Drop in a PDF. We extract every line, even from scans.' },
  { icon: BriefcaseBusiness, title: 'Apply to a role', body: 'Pick an open job and attach the resume you want to use.' },
  { icon: Wand2, title: 'Get AI insights', body: 'Run analysis for a score, fit summary and keyword gaps.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to a sharper application"
          body="From upload to actionable feedback in under a minute."
        />
        <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 md:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative inline-flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-card shadow-lg shadow-primary/20">
                <s.icon className="size-7 text-primary" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-background">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Roles() {
  const cards = [
    {
      icon: Users,
      tag: 'Job seekers',
      title: 'Your personal career copilot',
      points: ['Upload and manage resumes', 'Apply to open roles', 'AI analysis & match score', 'Mock interviews and learning plans'],
      href: '/register',
      cta: 'Create a free account',
    },
    {
      icon: LayoutDashboard,
      tag: 'Admins & recruiters',
      title: 'A hiring command center',
      points: ['Post, edit and close jobs', 'Review every application', 'Rank top matches per job', 'Pipeline analytics at a glance'],
      href: '/login',
      cta: 'Sign in as admin',
    },
  ]
  return (
    <section id="roles" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Built for both sides" title="One platform, two experiences" body="Role-based access shows each user exactly what they need." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass relative overflow-hidden rounded-3xl border border-border p-8"
            >
              <div className={`pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl ${i === 0 ? 'bg-primary/25' : 'bg-accent/20'}`} aria-hidden="true" />
              <c.icon className={`relative size-8 ${i === 0 ? 'text-primary' : 'text-accent'}`} aria-hidden="true" />
              <p className="relative mt-5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">{c.tag}</p>
              <h3 className="relative mt-2 text-2xl font-bold">{c.title}</h3>
              <ul className="relative mt-6 flex flex-col gap-3">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    <span className={`size-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-accent'}`} aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={c.href} className={btnClass(i === 0 ? 'primary' : 'outline', 'md', 'relative mt-8')}>
                {c.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
