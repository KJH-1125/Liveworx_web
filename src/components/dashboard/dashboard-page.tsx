'use client'

import StatCard from '@/components/dashboard/stat-card'
import {
  ClipboardIcon,
  ArchiveIcon,
  CogIcon,
  TruckIcon,
  DashboardIcon,
  SettingsIcon,
} from '@/components/icons'

export default function DashboardPageContent() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div>
      {/* 환영 메시지 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          대시보드
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{today}</p>
      </div>

      {/* 스탯 카드 그리드 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="주문내역"
          value="0건"
          icon={<ClipboardIcon className="h-5 w-5" />}
          accentColor="teal"
        />
        <StatCard
          title="재고현황"
          value="0건"
          icon={<ArchiveIcon className="h-5 w-5" />}
          accentColor="blue"
        />
        <StatCard
          title="생산현황"
          value="0건"
          icon={<CogIcon className="h-5 w-5" />}
          accentColor="amber"
        />
        <StatCard
          title="출하현황"
          value="0건"
          icon={<TruckIcon className="h-5 w-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="불량현황"
          value="0건"
          icon={<DashboardIcon className="h-5 w-5" />}
          accentColor="rose"
        />
        <StatCard
          title="설비가동률"
          value="0%"
          icon={<SettingsIcon className="h-5 w-5" />}
          accentColor="violet"
        />
      </div>
    </div>
  )
}
