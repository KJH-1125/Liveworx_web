import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  accentColor?: 'teal' | 'blue' | 'amber' | 'rose' | 'emerald' | 'violet'
}

const colorMap = {
  teal: {
    bar: 'bg-teal-500',
    iconBg: 'bg-teal-50 dark:bg-teal-500/10',
    iconText: 'text-teal-600 dark:text-teal-400',
  },
  blue: {
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
  },
  amber: {
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bar: 'bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    iconText: 'text-rose-600 dark:text-rose-400',
  },
  emerald: {
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    bar: 'bg-violet-500',
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
    iconText: 'text-violet-600 dark:text-violet-400',
  },
}

export default function StatCard({ title, value, icon, accentColor = 'teal' }: StatCardProps) {
  const colors = colorMap[accentColor]

  // Split value into number and unit
  const match = value.match(/^([\d,.]+)(.*)$/)
  const numPart = match ? match[1] : value
  const unitPart = match ? match[2] : ''

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      {/* 좌측 4px 컬러 바 */}
      <div className={`absolute left-0 top-0 h-full w-1 ${colors.bar}`} />
      <div className="flex items-center gap-4 p-5 pl-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconText}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-[var(--text-secondary)]">{title}</p>
          <p className="mt-0.5 text-[var(--text-primary)]">
            <span className="font-data text-2xl font-semibold">{numPart}</span>
            {unitPart && <span className="ml-0.5 text-sm text-[var(--text-secondary)]">{unitPart}</span>}
          </p>
        </div>
      </div>
    </div>
  )
}
