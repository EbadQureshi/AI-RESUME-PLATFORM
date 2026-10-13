'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { Role } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { ApiStatusButton } from '@/components/shared/api-settings'
import { AmbientBackground } from '@/components/shared/ambient-background'
import { Spinner } from '@/components/shared/ui-kit'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const navByRole: Record<Role, NavItem[]> = {
  job_applier: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/jobs', label: 'Find jobs', icon: BriefcaseBusiness },
    { href: '/dashboard/resumes', label: 'My resumes', icon: FileText },
    { href: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
    { href: '/dashboard/interviews', label: 'Interview prep', icon: MessagesSquare },
    { href: '/dashboard/learning', label: 'Learning', icon: GraduationCap },
  ],
  admin: [
    { href: '/admin', label: 'Analytics', icon: BarChart3, exact: true },
    { href: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  ],
}

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    } else if (user.role !== role) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, isLoading, role, router, pathname])

  useEffect(() => setMobileOpen(false), [pathname])

  if (isLoading || !user || user.role !== role) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <AmbientBackground />
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    )
  }

  const items = navByRole[role]
  const onLogout = () => {
    logout()
    router.replace('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center justify-between px-2 pt-1">
        <Logo href={role === 'admin' ? '/admin' : '/dashboard'} />
        <button
          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-2 flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs">
        <ShieldCheck className={cn('size-4', role === 'admin' ? 'text-accent' : 'text-primary')} aria-hidden="true" />
        <span className="text-muted-foreground">Signed in as</span>
        <span className="font-semibold">{role === 'admin' ? 'Admin' : 'Job seeker'}</span>
      </div>

      <nav aria-label="Workspace" className="flex-1">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/20 to-accent/5"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <item.icon className={cn('relative size-4.5', active && 'text-primary')} aria-hidden="true" />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-background">
            {user.email[0]?.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">ID #{user.id}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh lg:pl-72">
      <AmbientBackground />
      <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border lg:block">
        {sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {role === 'admin' ? 'Hiring command center' : 'Your career workspace'}
          </p>
        </div>
        <ApiStatusButton />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
