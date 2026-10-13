import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your workspace.">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  )
}
