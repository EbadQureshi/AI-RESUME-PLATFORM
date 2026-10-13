import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Start analyzing your resume against real roles.">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  )
}
