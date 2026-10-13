import type { Metadata } from 'next'
import { AmbientBackground } from '@/components/shared/ambient-background'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/cta-footer'
import { JobBrowser } from '@/components/jobs/job-browser'

export const metadata: Metadata = {
  title: 'Open roles',
  description: 'Browse open roles and apply with an AI-analyzed resume.',
}

export default function JobsPage() {
  return (
    <>
      <AmbientBackground />
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">Open roles</span>
          <h1 className="mt-3 text-4xl font-bold text-balance md:text-5xl">
            Find a role worth <span className="text-gradient">optimizing for</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Every application gets an AI match score and keyword gap analysis.
          </p>
        </div>
        <JobBrowser />
      </main>
      <SiteFooter />
    </>
  )
}
