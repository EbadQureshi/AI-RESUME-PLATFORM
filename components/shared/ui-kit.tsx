'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type BtnSize = 'sm' | 'md' | 'lg' | 'icon'

const variantClasses: Record<BtnVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-[oklch(0.6_0.2_260)] text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:brightness-110',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
  outline: 'border border-border bg-transparent text-foreground hover:bg-secondary/60',
  ghost: 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
  danger: 'bg-destructive/15 text-destructive hover:bg-destructive/25',
}

const sizeClasses: Record<BtnSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'size-9',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  loading?: boolean
}

export const Btn = forwardRef<HTMLButtonElement, ButtonProps>(function Btn(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-xl font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})

export function btnClass(variant: BtnVariant = 'primary', size: BtnSize = 'md', className?: string) {
  return cn(
    'relative inline-flex shrink-0 items-center justify-center rounded-xl font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('glass rounded-2xl border border-border p-5 shadow-xl shadow-black/20', className)}
      {...props}
    />
  )
}

interface FieldProps {
  label: string
  id: string
  hint?: string
  error?: string
  children: React.ReactNode
}

export function Field({ label, id, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

const inputBase =
  'w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all outline-none focus:border-primary/60 focus:ring-3 focus:ring-primary/20 disabled:opacity-60'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(inputBase, 'h-11', className)} {...props} />
  },
)

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(inputBase, 'min-h-28 py-3 leading-relaxed', className)} {...props} />
})

export function Badge({
  className,
  tone = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'
}) {
  const tones = {
    default: 'bg-secondary text-secondary-foreground border-border',
    primary: 'bg-primary/15 text-primary border-primary/30',
    accent: 'bg-accent/15 text-accent border-accent/30',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-destructive/15 text-destructive border-destructive/30',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-secondary/60', className)} />
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-5 animate-spin text-primary', className)} aria-label="Loading" />
}
