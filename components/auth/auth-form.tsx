'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { errorMessage } from '@/lib/api/client'
import { Btn, Field, Input } from '@/components/shared/ui-kit'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isRegister = mode === 'register'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (isRegister && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const user = isRegister ? await register(email, password, fullName) : await login(email, password)
      toast.success(isRegister ? 'Account created' : 'Welcome back', { description: user.email })
      const next = params.get('next')
      const home = user.role === 'admin' ? '/admin' : '/dashboard'
      router.replace(next && next.startsWith('/') ? next : home)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {isRegister && (
        <Field label="Full name" id="full-name" hint="Shown on your interview competition leaderboard.">
          <Input id="full-name" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" maxLength={160} />
        </Field>
      )}
      <Field label="Email" id="email">
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>
      </Field>
      <Field
        label="Password"
        id="password"
        hint={isRegister ? 'At least 8 characters.' : undefined}
      >
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="password"
            type={showPw ? 'text' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
            minLength={isRegister ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <Btn type="submit" size="lg" loading={loading} className="w-full">
        {isRegister ? 'Create account' : 'Sign in'}
      </Btn>

      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? 'Already have an account? ' : 'New to ResumeAI? '}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="font-medium text-primary hover:underline"
        >
          {isRegister ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
      {isRegister && (
        <p className="text-center text-xs text-muted-foreground">
          New accounts are job seeker accounts. Admin accounts are provisioned by your team.
        </p>
      )}
    </form>
  )
}
