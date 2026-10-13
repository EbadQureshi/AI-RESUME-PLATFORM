'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { BookOpenCheck, FileScan, GaugeCircle, MessagesSquare, ScanSearch, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: FileScan,
    title: 'Smart PDF extraction',
    body: 'Text-based PDFs parse instantly. Scanned resumes fall back to OCR automatically.',
  },
  {
    icon: ScanSearch,
    title: 'Keyword gap analysis',
    body: 'See job keywords, which ones you matched, and which ones are missing.',
  },
  {
    icon: GaugeCircle,
    title: 'Match scoring',
    body: 'Every application gets a score so you know where you stand before you hit apply.',
  },
  {
    icon: MessagesSquare,
    title: 'AI mock interviews',
    body: 'Answer role-specific questions one at a time and get final, actionable feedback.',
  },
  {
    icon: BookOpenCheck,
    title: 'Learning roadmaps',
    body: 'A personalized plan built from your gaps, with practice questions to close them.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-based access',
    body: 'Admins manage jobs and candidates. Job seekers only see their own data.',
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything between your resume and the offer"
          body="One workspace to analyze, apply, practice and improve, powered by AI end to end."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl border border-border p-6"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/25" aria-hidden="true" />
              <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 to-accent/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <f.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass mt-16 grid items-center gap-8 overflow-hidden rounded-3xl border border-border p-6 md:grid-cols-2 md:p-10"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Interview coach</span>
            <h3 className="mt-3 text-2xl font-bold text-balance md:text-3xl">
              Rehearse with an interviewer that knows the job description
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Start a session from any application. Questions are generated from the role and your
              resume, and when you finish you get a structured breakdown of strengths and next steps.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/interview-ai.png"
              alt="Candidate in a video interview with an AI assistant"
              width={900}
              height={600}
              className="aspect-[3/2] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">{title}</h2>
      <p className="mt-4 text-muted-foreground text-pretty">{body}</p>
    </motion.div>
  )
}
