import { create } from 'zustand'

export type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string    // default "Confirm"
  cancelLabel?: string     // default "Cancel"
  variant?: ConfirmVariant // default "danger"
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions | null
  // Internal — holds the resolve fn of the pending promise
  _resolve: ((value: boolean) => void) | null

  _open: (options: ConfirmOptions, resolve: (v: boolean) => void) => void
  _answer: (value: boolean) => void
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: null,
  _resolve: null,

  _open: (options, resolve) =>
    set({ isOpen: true, options, _resolve: resolve }),

  _answer: (value) => {
    get()._resolve?.(value)
    set({ isOpen: false, options: null, _resolve: null })
  },
}))

// ─── confirm() — call this anywhere, awaits the user's answer ─────────────────
//
// Usage:
//   const yes = await confirm({ title: 'Delete item?', message: 'This cannot be undone.' })
//   if (yes) { /* proceed */ }

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirmStore.getState()._open(options, resolve)
  })
}