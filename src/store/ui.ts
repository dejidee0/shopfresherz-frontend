'use client'

import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCategoryMenuOpen: boolean

  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleCategoryMenu: () => void
  closeCategoryMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCategoryMenuOpen: false,

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleCategoryMenu: () => set((s) => ({ isCategoryMenuOpen: !s.isCategoryMenuOpen })),
  closeCategoryMenu: () => set({ isCategoryMenuOpen: false }),
}))