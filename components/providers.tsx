'use client'

import { SWRConfig } from 'swr'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
      <AuthProvider>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          toastOptions={{ className: 'font-sans' }}
        />
      </AuthProvider>
    </SWRConfig>
  )
}
