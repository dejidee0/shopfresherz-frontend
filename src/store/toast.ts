import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number   // ms, default 4000. Pass 0 for persistent.
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  push: (toast) => {
    const id = Math.random().toString(36).slice(2, 9)
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    return id
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  dismissAll: () => set({ toasts: [] }),
}))

// ─── Convenience functions ────────────────────────────────────────────────────
// Call these anywhere — inside API handlers, event callbacks, outside React.

const { push, dismiss } = useToastStore.getState()

// Re-bind to always use current store state
function getStore() {
  return useToastStore.getState()
}

export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    getStore().push({ type: 'success', title, message, duration }),

  error: (title: string, message?: string, duration?: number) =>
    getStore().push({ type: 'error', title, message, duration: duration ?? 6000 }),

  warning: (title: string, message?: string, duration?: number) =>
    getStore().push({ type: 'warning', title, message, duration }),

  info: (title: string, message?: string, duration?: number) =>
    getStore().push({ type: 'info', title, message, duration }),

  dismiss: (id: string) => getStore().dismiss(id),

  dismissAll: () => getStore().dismissAll(),

  /** Show a loading toast, returns a function to dismiss it */
  loading: (title: string, message?: string): (() => void) => {
    const id = getStore().push({ type: 'info', title, message, duration: 0 })
    return () => getStore().dismiss(id)
  },
}