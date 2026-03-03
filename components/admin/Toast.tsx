'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
})

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              animation: 'admin-toast-slide-up 0.3s ease-out',
            }}
            className={`pointer-events-auto px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all
              ${toast.type === 'success' ? 'bg-emerald-600' : ''}
              ${toast.type === 'error' ? 'bg-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-600' : ''}
            `}
          >
            {toast.type === 'success' && '✓ '}
            {toast.type === 'error' && '✕ '}
            {toast.type === 'info' && 'ℹ '}
            {toast.message}
          </div>
        ))}
      </div>
      {/* Inline style element instead of styled-jsx which is not supported in App Router */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-toast-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
