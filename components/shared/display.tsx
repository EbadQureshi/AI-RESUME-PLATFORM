'use client'

import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'
import type { ApplicationStatus } from '@/lib/api/types'
import { Badge } from './ui-kit'

const avatarGradients = [
  'from-primary to-accent',
  'from-accent to-success',
  'from-warning to-destructive',
  'from-[oklch(0.6_0.2_260)] to-primary',
  'from-success to-accent',
  'from-destructive to-primary',
]

export function CompanyAvatar({ name, className }: { name: string; className?: string }) {
  const idx = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % avatarGradients.length
  return (
    <span
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-sm font-bold text-background shadow-lg',
        avatarGradients[idx],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </span>
  )
}

const statusTone: Record<ApplicationStatus, 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'> = {
  received: 'default',
  reviewing: 'accent',
  interviewed: 'primary',
  selected: 'success',
  rejected: 'danger',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge tone={statusTone[status]} className="capitalize">
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </Badge>
  )
}

export function ScoreRing({
  value,
  size = 72,
  label,
}: {
  value: number | null
  size?: number
  label?: string
}) {
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = value ?? 0
  const color =
    value === null ? 'var(--muted-foreground)' : pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--destructive)'

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--secondary)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-display text-base font-bold">{value === null ? '—' : `${pct}%`}</span>
        {label && <span className="mt-0.5 text-[10px] text-muted-foreground">{label}</span>}
      </div>
      <span className="sr-only">{value === null ? 'No score yet' : `Score ${pct} percent`}</span>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="hidden size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary sm:inline-flex">
            <Icon className="size-6" aria-hidden="true" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold text-balance md:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.header>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center"
    >
      <span className="relative mb-5 inline-flex size-16 items-center justify-center rounded-2xl bg-secondary">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" aria-hidden="true" />
        <Icon className="size-7 text-primary" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-destructive">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="self-start rounded-lg bg-destructive/20 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/30 sm:self-auto">
          Retry
        </button>
      )}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  delay = 0,
}: {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'danger'
  delay?: number
}) {
  const iconTones = {
    primary: 'text-primary bg-primary/12',
    accent: 'text-accent bg-accent/12',
    success: 'text-success bg-success/12',
    warning: 'text-warning bg-warning/12',
    danger: 'text-destructive bg-destructive/12',
  }
  const glowTones = {
    primary: 'bg-primary/30',
    accent: 'bg-accent/30',
    success: 'bg-success/30',
    warning: 'bg-warning/30',
    danger: 'bg-destructive/30',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="glass group relative overflow-hidden rounded-2xl border border-border p-5"
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-90',
          glowTones[tone],
        )}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn('inline-flex size-9 items-center justify-center rounded-xl', iconTones[tone])}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-4 font-display text-3xl font-bold tabular-nums">{value}</p>
    </motion.div>
  )
}
