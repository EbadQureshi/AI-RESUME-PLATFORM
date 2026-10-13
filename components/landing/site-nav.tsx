'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { btnClass } from '@/components/shared/ui-kit'
import { ApiStatusButton } from '@/components/shared/api-settings'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#roles', label: 'For teams' },
  { href: '/jobs', label: 'Open roles' },
]

export function SiteNav() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4"
    >
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300',
          scrolled ? 'glass border-border shadow-xl shadow-black/30' : 'border-transparent',
        )}
        aria-label="Main"
      >
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ApiStatusButton className="hidden lg:inline-flex" />
          {user ? (
            <Link href={dashboardHref} className={btnClass('primary', 'sm')}>
              Open dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={btnClass('ghost', 'sm', 'hidden sm:inline-flex')}>
                Sign in
              </Link>
              <Link href="/register" className={btnClass('primary', 'sm')}>
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
