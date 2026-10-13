import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



import { AmbientBackground } from '@/components/shared/ambient-background'
import { SiteNav } from '@/components/landing/site-nav'
import { Hero } from '@/components/landing/hero'
import { SkillsMarquee } from '@/components/landing/skills-marquee'
import { Features } from '@/components/landing/features'
import { HowItWorks, Roles } from '@/components/landing/how-it-works'
import { FinalCta, SiteFooter } from '@/components/landing/cta-footer'

export default function HomePage() {
  return (
    <>
      <AmbientBackground />
      <SiteNav />
      <main>
        <Hero />
        <SkillsMarquee />
        <Features />
        <HowItWorks />
        <Roles />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
