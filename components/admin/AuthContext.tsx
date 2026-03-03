'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { adminClient, getSession, signIn, signOut } from '@/lib/supabase/admin'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then((s) => {
        setSession(s)
      })
      .catch(() => {
        setSession(null)
      })
      .finally(() => {
        setLoading(false)
      })

    if (adminClient) {
      // Import types from supabase-js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: { subscription } } = adminClient.auth.onAuthStateChange(
        (_event: any, session: any) => {
          setSession(session)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const data = await signIn(email, password)
    setSession(data.session)
  }

  const logout = async () => {
    await signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
