'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { btnClass } from '@/components/shared/ui-kit'

const headline = ['Land', 'the', 'role.', 'Let', 'AI', 'read', 'your', 'resume', 'first.']

export function Hero() {
  return (
    <section className="relative px-4 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            AI resume analysis, interview prep & learning plans
          </motion.span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold text-balance sm:text-5xl lg:text-6xl">
            {headline.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                className={`mr-[0.25em] inline-block ${word === 'AI' ? 'text-gradient' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Upload a PDF, apply to open roles and instantly see matched and missing keywords, a fit
            summary, and exactly what to add or cut. Then rehearse with an AI interviewer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/register" className={btnClass('primary', 'lg', 'group')}>
              Analyze my resume
              <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/jobs" className={btnClass('outline', 'lg')}>
              Browse open roles
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {['PDF & OCR extraction', 'Keyword gap analysis', 'Mock interviews'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-primary/40 to-accent/30 blur-3xl" aria-hidden="true" />
      <div className="relative animate-float overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-primary/20">
        <Image
          src="/images/hero-resume.png"
          alt="Holographic resume being scanned by AI with highlighted skills"
          width={900}
          height={900}
          priority
          className="aspect-square w-full object-cover"
        />
        <div className="absolute inset-x-6 h-0.5 animate-scan bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_4px] shadow-accent/50" aria-hidden="true" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1 }}
        className="glass absolute -left-4 bottom-12 flex items-center gap-3 rounded-2xl border border-border p-3 shadow-xl sm:-left-10"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
          <TrendingUp className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Match score</p>
          <p className="font-display text-lg font-bold">87%</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3 }}
        className="glass absolute -right-2 top-10 max-w-48 rounded-2xl border border-border p-3 shadow-xl sm:-right-8"
      >
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-warning" aria-hidden="true" /> Missing keywords
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {['Kubernetes', 'GraphQL', 'CI/CD'].map((k) => (
            <span key={k} className="rounded-md bg-destructive/15 px-1.5 py-0.5 text-[11px] text-destructive">
              {k}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
