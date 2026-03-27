'use client'

import type { QnaManhourInfo } from '@/lib/services/qna-service'

interface Props {
  manhour: QnaManhourInfo
}

export default function QnaManhourBar({ manhour }: Props) {
  const totalHour = manhour.MANHOUR1 + manhour.PAY_SUM   // 총 공수
  const usedHour = manhour.MANHOUR2 + manhour.PAY_USE     // 사용량
  const remainHour = manhour.MANHOUR1 - manhour.MANHOUR2 + manhour.PAY_HOUR // 잔여량
  const extraHour = manhour.PAY_SUM                        // 추가공수

  if (!manhour.EXPDTTM) return null

  const isExpired = new Date(manhour.EXPDTTM) < new Date()
  const percentage = totalHour > 0 ? Math.max(0, Math.min(100, (remainHour / totalHour) * 100)) : 0

  const barColor =
    percentage > 30 ? 'bg-teal-500' :
    percentage > 10 ? 'bg-amber-500' :
    'bg-rose-500'

  const expiryDate = isExpired
    ? '갱신대기'
    : new Date(new Date(manhour.EXPDTTM).getTime() + 86400000).toISOString().slice(0, 10)

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-secondary)]">공수 현황</span>
        <span className="text-[var(--text-muted)]">
          갱신일: {isExpired ? <span className="text-rose-500">갱신대기</span> : expiryDate}
        </span>
      </div>

      {isExpired ? (
        <div className="text-center text-sm text-rose-500">공수 갱신이 필요합니다</div>
      ) : (
        <>
          {/* 프로그래스 바 */}
          <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* 수치 */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-[var(--text-muted)]">총 공수</div>
              <div className="font-semibold font-mono text-[var(--text-primary)]">{totalHour}h</div>
            </div>
            <div>
              <div className="text-[var(--text-muted)]">사용량</div>
              <div className="font-semibold font-mono text-[var(--text-primary)]">{usedHour}h</div>
            </div>
            <div>
              <div className="text-[var(--text-muted)]">잔여량</div>
              <div className={`font-semibold font-mono ${remainHour < 10 ? 'text-rose-500' : 'text-teal-600 dark:text-teal-400'}`}>
                {remainHour}h
              </div>
            </div>
            <div>
              <div className="text-[var(--text-muted)]">추가공수</div>
              <div className="font-semibold font-mono text-[var(--text-primary)]">{extraHour}h</div>
            </div>
          </div>

          {/* 담당자 */}
          {manhour.NAME && (
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              담당: {manhour.NAME} {manhour.EMAIL && `/ ${manhour.EMAIL}`}
            </div>
          )}
        </>
      )}
    </div>
  )
}
