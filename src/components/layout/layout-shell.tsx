'use client'

import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { TabProvider } from '@/contexts/tab-context'
import Sidebar from './sidebar'
import Header from './header'
import TabBar from './tab-bar'
import TabContent from './tab-content'
import type { MenuItem } from '@/lib/services/menu-service'

function LayoutInner({
  menuItems,
  children,
}: {
  menuItems: MenuItem[]
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar menuItems={menuItems} />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isCollapsed ? 'md:pl-16' : 'md:pl-64'
        }`}
      >
        <Header />
        <TabBar />
        <main className="flex-1 overflow-hidden">
          <TabContent />
        </main>
      </div>
    </div>
  )
}

export default function LayoutShell({
  menuItems,
  children,
}: {
  menuItems: MenuItem[]
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <TabProvider>
        <LayoutInner menuItems={menuItems}>
          {children}
        </LayoutInner>
      </TabProvider>
    </SidebarProvider>
  )
}
