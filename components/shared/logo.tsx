import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5 text-primary-foreground" fill="none">
        <path
          d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="M8.5 15.5 11 13l2 2 3-3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-60" />
    </span>
  )
}

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('group flex items-center gap-2.5', className)}>
      <LogoMark className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
      <span className="font-display text-lg font-semibold tracking-tight">
        Resume<span className="text-gradient">AI</span>
      </span>
    </Link>
  )
}
