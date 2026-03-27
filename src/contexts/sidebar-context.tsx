'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapse: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

const SidebarContext = createContext<SidebarState | null>(null)

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return ctx
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    // 초기값: 1024px 미만이면 collapsed
    setIsCollapsed(window.innerWidth < 1024)

    const onResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleCollapse = useCallback(() => setIsCollapsed(prev => !prev), [])
  const toggleMobile = useCallback(() => setIsMobileOpen(prev => !prev), [])
  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return (
    <SidebarContext value={{
      isCollapsed,
      isMobileOpen,
      toggleCollapse,
      toggleMobile,
      closeMobile,
    }}>
      {children}
    </SidebarContext>
  )
}
