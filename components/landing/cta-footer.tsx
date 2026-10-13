'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { btnClass } from '@/components/shared/ui-kit'

export function FinalCta() {
  return (
    <section className="px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/25 via-card to-accent/15 px-6 py-16 text-center md:px-16"
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <h2 className="relative text-3xl font-bold text-balance md:text-5xl">
          Your next role starts with a <span className="text-gradient">better resume</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          Create an account in seconds and get your first AI analysis today.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className={btnClass('primary', 'lg', 'group')}>
            Get started free
            <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link href="/jobs" className={btnClass('outline', 'lg')}>
            See open roles
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          {'© '}
          {new Date().getFullYear()} ResumeAI. AI-powered resume analysis.
        </p>
        <nav aria-label="Footer" className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/jobs" className="hover:text-foreground">Jobs</Link>
          <Link href="/login" className="hover:text-foreground">Sign in</Link>
          <Link href="/register" className="hover:text-foreground">Register</Link>
        </nav>
      </div>
    </footer>
  )
}
