'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { XIcon } from '@/components/icons'
import MenuTree from './menu-tree'
import type { MenuItem } from '@/lib/services/menu-service'

export default function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar()

  return (
    <>
      {/* 모바일 백드롭 */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* 사이드바 - 항상 다크 배경 */}
      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-full flex-col
          bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]
          transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isCollapsed ? 'md:w-16' : 'md:w-64'}
          w-64
        `}
      >
        {/* 상단 로고 */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex items-center gap-2.5">
              {/* 아이콘 마크 */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
                <svg className="h-4.5 w-4.5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2L3 7v6l7 5 7-5V7l-7-5zM10 4.5L14.5 7.5v5L10 15.5 5.5 12.5v-5L10 4.5z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                LiveWorx
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
              <svg className="h-4.5 w-4.5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2L3 7v6l7 5 7-5V7l-7-5zM10 4.5L14.5 7.5v5L10 15.5 5.5 12.5v-5L10 4.5z" />
              </svg>
            </div>
          )}
          {/* 모바일 닫기 */}
          {isMobileOpen && (
            <button
              onClick={closeMobile}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:hidden"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 메뉴 영역 */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <MenuTree items={menuItems} />
        </div>

        {/* 하단 정보 영역 */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="shrink-0 border-t border-[var(--sidebar-border)] px-4 py-3">
            <p className="text-[11px] text-slate-500">LiveWorx ERP/MES</p>
            <p className="text-[10px] text-slate-600">v1.0.0</p>
          </div>
        )}
      </aside>
    </>
  )
}
