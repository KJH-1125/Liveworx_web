'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      // 기본 라이트모드
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }, [])

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}
