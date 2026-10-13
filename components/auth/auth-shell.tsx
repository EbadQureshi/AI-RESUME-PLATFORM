'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { ApiStatusButton } from '@/components/shared/api-settings'
import { AmbientBackground } from '@/components/shared/ambient-background'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AmbientBackground />
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ApiStatusButton />
        </div>
        <main className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </main>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border lg:block">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/images/auth-visual.png"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass absolute right-10 bottom-10 left-10 rounded-3xl border border-border p-7"
        >
          <Quote className="size-7 text-primary" aria-hidden="true" />
          <blockquote className="mt-3 text-lg leading-relaxed text-pretty">
            The missing-keyword list told me exactly what my resume was hiding. Three tweaks later I
            had two interviews booked.
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">
            Priya S. · Backend Engineer
          </figcaption>
        </motion.figure>
      </div>
    </div>
  )
}
