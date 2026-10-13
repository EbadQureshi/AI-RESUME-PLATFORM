'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { timeAgo, toPct } from '@/lib/format'
import type { Application, Job } from '@/lib/api/types'
import { CompanyAvatar, ScoreRing, StatusBadge } from '@/components/shared/display'

export function ApplicationRow({ app, job, index = 0 }: { app: Application; job?: Job; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        href={`/dashboard/applications/${app.id}`}
        className="glass group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:border-primary/40 hover:bg-secondary/30"
      >
        <CompanyAvatar name={job?.company ?? 'Job'} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium group-hover:text-primary">{job?.title ?? `Job #${app.job_id}`}</p>
          <p className="truncate text-sm text-muted-foreground">
            {job?.company ?? 'Closed role'} · {timeAgo(app.created_at)}
          </p>
        </div>
        <div className="hidden sm:block">
          <StatusBadge status={app.status} />
        </div>
        <ScoreRing value={toPct(app.match_score)} size={52} />
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </motion.div>
  )
}
