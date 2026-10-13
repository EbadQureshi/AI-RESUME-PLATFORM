'use client'

import { motion } from 'motion/react'
import { CheckCircle2, Lightbulb, MinusCircle, PlusCircle, XCircle } from 'lucide-react'
import type { Analysis } from '@/lib/api/types'
import { Card } from '@/components/shared/ui-kit'
import { cn } from '@/lib/utils'

export function AnalysisPanel({ analysis }: { analysis: Analysis }) {
  const total = analysis.job_keywords.length || 1
  const coverage = Math.round((analysis.matched_keywords.length / total) * 100)

  return (
    <div className="flex flex-col gap-5">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          <Lightbulb className="size-4 text-warning" aria-hidden="true" /> Fit summary
        </h3>
        <div className="relative mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">ATS readiness: {analysis.ats_score}%</span>
          <span className="text-xs text-muted-foreground">Heuristic estimate of structure, contact details, and job-keyword coverage—not a guarantee from any specific ATS vendor.</span>
        </div>
        <p className="relative mt-3 leading-relaxed text-pretty">{analysis.fit_summary}</p>

        <div className="relative mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Keyword coverage</span>
            <span className="tabular-nums">
              {analysis.matched_keywords.length}/{analysis.job_keywords.length} · {coverage}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${coverage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <KeywordCard title="Matched keywords" items={analysis.matched_keywords} tone="success" icon={CheckCircle2} />
        <KeywordCard title="Missing keywords" items={analysis.missing_keywords} tone="danger" icon={XCircle} />
        <ListCard title="Suggested additions" items={analysis.suggested_additions} icon={PlusCircle} tone="primary" />
        <ListCard title="Suggested removals" items={analysis.suggested_removals} icon={MinusCircle} tone="warning" />
      </div>
    </div>
  )
}

const toneText = {
  success: 'text-success',
  danger: 'text-destructive',
  primary: 'text-primary',
  warning: 'text-warning',
}
const toneChip = {
  success: 'border-success/30 bg-success/10 text-success',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
}

function KeywordCard({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string
  items: string[]
  tone: 'success' | 'danger'
  icon: typeof CheckCircle2
}) {
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn('size-4', toneText[tone])} aria-hidden="true" /> {title}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{items.length}</span>
      </h3>
      {items.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((k, i) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.6) }}
              className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', toneChip[tone])}
            >
              {k}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">None</p>
      )}
    </Card>
  )
}

function ListCard({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string
  items: string[]
  icon: typeof PlusCircle
  tone: 'primary' | 'warning'
}) {
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn('size-4', toneText[tone])} aria-hidden="true" /> {title}
      </h3>
      {items.length ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="flex gap-2.5 text-sm leading-relaxed"
            >
              <span className={cn('mt-2 size-1.5 shrink-0 rounded-full bg-current', toneText[tone])} aria-hidden="true" />
              <span className="text-foreground/90">{s}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Nothing to suggest.</p>
      )}
    </Card>
  )
}
