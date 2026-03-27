'use client'

import { Suspense } from 'react'
import { useTab } from '@/contexts/tab-context'
import { tabRegistry, resolveTabPath } from '@/lib/tab-registry'

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">
      <p>메뉴에서 화면을 선택하세요</p>
    </div>
  )
}

function TabFallback() {
  return (
    <div className="flex h-32 items-center justify-center text-[var(--text-secondary)]">
      로딩 중...
    </div>
  )
}

function UnregisteredTab({ path }: { path: string }) {
  return (
    <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">
      <p>준비 중인 화면입니다: {path}</p>
    </div>
  )
}

export default function TabContent() {
  const { tabs, activeTabId } = useTab()

  if (tabs.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {tabs.map(tab => {
        const resolved = resolveTabPath(tab.path)
        const entry = tabRegistry[resolved]
        const isActive = tab.id === activeTabId

        return (
          <div
            key={tab.id}
            style={{ display: isActive ? 'block' : 'none' }}
            className="h-full overflow-y-auto p-4 md:p-6"
          >
            {entry ? (
              <Suspense fallback={<TabFallback />}>
                <entry.component />
              </Suspense>
            ) : (
              <UnregisteredTab path={tab.path} />
            )}
          </div>
        )
      })}
    </>
  )
}
