'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { useSession } from '@/contexts/session-context'
import { useTheme } from '@/contexts/theme-context'
import { logout } from '@/app/actions/auth'
import { MenuIcon, ChevronLeftIcon, ChevronRightIcon, LogoutIcon, UserIcon, SunIcon, MoonIcon } from '@/components/icons'

export default function Header() {
  const { isCollapsed, toggleCollapse, toggleMobile } = useSidebar()
  const session = useSession()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 backdrop-blur-md">
      {/* 좌측: 토글 + 페이지 제목 */}
      <div className="flex items-center gap-3">
        {/* 모바일 햄버거 */}
        <button
          onClick={toggleMobile}
          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] md:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        {/* 데스크탑 collapse 토글 */}
        <button
          onClick={toggleCollapse}
          className="hidden rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] md:flex"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* 우측: 테마 토글 + 사용자 + 로그아웃 */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          title={theme === 'light' ? '다크모드' : '라이트모드'}
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </button>

        <div className="mx-1 h-6 w-px bg-[var(--border)]" />

        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          {/* 아바타 원형 배지 */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
            <UserIcon className="h-3.5 w-3.5" />
          </div>
          <span className="hidden font-medium text-[var(--text-primary)] sm:inline">{session.userName}</span>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            <LogoutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </form>
      </div>
    </header>
  )
}
