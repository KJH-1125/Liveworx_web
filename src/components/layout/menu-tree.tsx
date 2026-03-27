'use client'

import { useState } from 'react'
import { useSidebar } from '@/contexts/sidebar-context'
import { useTab } from '@/contexts/tab-context'
import { resolveTabPath } from '@/lib/tab-registry'
import { ChevronDownIcon } from '@/components/icons'
import { iconMap } from '@/components/icons'
import type { MenuItem } from '@/lib/services/menu-service'

function MenuCategory({ item }: { item: MenuItem }) {
  const [expanded, setExpanded] = useState(false)
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar()
  const { activeTabId, openTab } = useTab()

  const IconComponent = iconMap[item.icon]
  const hasActiveChild = item.children?.some(child =>
    activeTabId === child.href || activeTabId === resolveTabPath(child.href || '')
  )

  // 모바일 사이드바가 열려있으면 항상 펼친 뷰 표시
  if (isCollapsed && !isMobileOpen) {
    return (
      <div className="relative group">
        <button
          title={item.label}
          className={`flex w-full items-center justify-center rounded-lg p-2.5 text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-slate-200 ${
            hasActiveChild ? 'bg-[var(--sidebar-active-bg)] text-teal-400' : ''
          }`}
          onClick={() => setExpanded(prev => !prev)}
        >
          {IconComponent && <IconComponent className="h-5 w-5 shrink-0" />}
        </button>
        {/* 축소 모드 팝오버 */}
        {expanded && (
          <div className="absolute left-full top-0 z-50 ml-2 min-w-[160px] rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-lg">
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
            {item.children?.map(child => (
              <button
                key={child.id}
                onClick={() => {
                  if (child.href) openTab(resolveTabPath(child.href), child.label)
                  closeMobile()
                }}
                className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-slate-700 ${
                  activeTabId === child.href || activeTabId === resolveTabPath(child.href || '')
                    ? 'text-teal-400'
                    : 'text-slate-300'
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* 카테고리 헤더 */}
      <button
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-slate-200 ${
          hasActiveChild ? 'text-slate-200' : ''
        }`}
        onClick={() => setExpanded(prev => !prev)}
      >
        {IconComponent && <IconComponent className="h-5 w-5 shrink-0 text-teal-400" />}
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
          {item.children?.map(child => (
            <MenuLeaf key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

function MenuLeaf({ item }: { item: MenuItem }) {
  const { closeMobile } = useSidebar()
  const { activeTabId, openTab } = useTab()
  const isActive = activeTabId === item.href || activeTabId === resolveTabPath(item.href || '')

  return (
    <button
      onClick={() => {
        if (item.href) openTab(resolveTabPath(item.href), item.label)
        closeMobile()
      }}
      className={`relative block w-full text-left rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? 'bg-[var(--sidebar-active-bg)] font-medium text-teal-400 before:absolute before:left-[-13px] before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-full before:bg-teal-400'
          : 'text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-slate-200'
      }`}
    >
      {item.label}
    </button>
  )
}

export default function MenuTree({ items }: { items: MenuItem[] }) {
  return (
    <nav className="space-y-1">
      {items.map(item =>
        item.children ? (
          <MenuCategory key={item.id} item={item} />
        ) : (
          <MenuLeaf key={item.id} item={item} />
        )
      )}
    </nav>
  )
}
