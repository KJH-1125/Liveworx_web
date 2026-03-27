'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface TabItem {
  id: string    // = path (unique key)
  path: string  // route path ("/master/customer")
  label: string // display name
}

interface TabContextValue {
  tabs: TabItem[]
  activeTabId: string | null
  openTab(path: string, label: string): void
  closeTab(id: string): void
  activateTab(id: string): void
  closeOtherTabs(id: string): void
  closeAllTabs(): void
}

const TabContext = createContext<TabContextValue | null>(null)

export function useTab() {
  const ctx = useContext(TabContext)
  if (!ctx) {
    throw new Error('useTab must be used within TabProvider')
  }
  return ctx
}

const STORAGE_KEY = 'liveworx-tabs'
const ACTIVE_KEY = 'liveworx-active-tab'
const DASHBOARD_TAB: TabItem = { id: '/dashboard', path: '/dashboard', label: '대시보드' }

function loadTabs(): { tabs: TabItem[]; activeTabId: string | null } {
  if (typeof window === 'undefined') {
    return { tabs: [DASHBOARD_TAB], activeTabId: DASHBOARD_TAB.id }
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const active = sessionStorage.getItem(ACTIVE_KEY)
    if (raw) {
      const tabs: TabItem[] = JSON.parse(raw)
      if (tabs.length > 0) {
        return {
          tabs,
          activeTabId: active && tabs.some(t => t.id === active) ? active : tabs[0].id,
        }
      }
    }
  } catch {}
  return { tabs: [DASHBOARD_TAB], activeTabId: DASHBOARD_TAB.id }
}

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>(() => loadTabs().tabs)
  const [activeTabId, setActiveTabId] = useState<string | null>(() => loadTabs().activeTabId)

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  }, [tabs])

  useEffect(() => {
    if (activeTabId) {
      sessionStorage.setItem(ACTIVE_KEY, activeTabId)
    }
  }, [activeTabId])

  const openTab = useCallback((path: string, label: string) => {
    setTabs(prev => {
      const exists = prev.find(t => t.id === path)
      if (!exists) {
        return [...prev, { id: path, path, label }]
      }
      return prev
    })
    setActiveTabId(path)
  }, [])

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === id)
      if (idx === -1) return prev
      const next = prev.filter(t => t.id !== id)
      // Activate adjacent tab if closing the active one
      setActiveTabId(current => {
        if (current !== id) return current
        if (next.length === 0) return null
        // Prefer left neighbor, then right
        const newIdx = idx > 0 ? idx - 1 : 0
        return next[newIdx].id
      })
      return next
    })
  }, [])

  const activateTab = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const closeOtherTabs = useCallback((id: string) => {
    setTabs(prev => prev.filter(t => t.id === id))
    setActiveTabId(id)
  }, [])

  const closeAllTabs = useCallback(() => {
    setTabs([])
    setActiveTabId(null)
  }, [])

  return (
    <TabContext value={{ tabs, activeTabId, openTab, closeTab, activateTab, closeOtherTabs, closeAllTabs }}>
      {children}
    </TabContext>
  )
}
