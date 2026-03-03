'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/components/admin/AuthContext'
import { ToastProvider } from '@/components/admin/Toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

  useEffect(() => {
    if (!loading && !session && !isLoginPage) {
      router.push('/admin/login/')
    }
  }, [session, loading, isLoginPage, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Login page - no sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Not authenticated - show nothing while redirecting
  if (!session) {
    return null
  }

  // Authenticated - show admin layout
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ToastProvider>
    </AuthProvider>
  )
}
