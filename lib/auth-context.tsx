'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { api } from './api/endpoints'
import { getToken, setToken } from './api/client'
import type { User } from './api/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, fullName?: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const { mutate: globalMutate } = useSWRConfig()

  useEffect(() => {
    setTokenState(getToken())
    setHydrated(true)
    const onUnauthorized = () => setTokenState(null)
    window.addEventListener('resumeai:unauthorized', onUnauthorized)
    return () => window.removeEventListener('resumeai:unauthorized', onUnauthorized)
  }, [])

  const { data: user, isLoading: userLoading } = useSWR(
    token ? ['me', token] : null,
    () => api.auth.me(),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login(email, password)
      setToken(res.access_token)
      const me = await api.auth.me()
      await globalMutate(['me', res.access_token], me, { revalidate: false })
      setTokenState(res.access_token)
      return me
    },
    [globalMutate],
  )

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      await api.auth.register(email, password, fullName)
      return login(email, password)
    },
    [login],
  )

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    globalMutate(() => true, undefined, { revalidate: false })
  }, [globalMutate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: token ? (user ?? null) : null,
      token,
      isLoading: !hydrated || (!!token && userLoading),
      login,
      register,
      logout,
    }),
    [token, user, hydrated, userLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
