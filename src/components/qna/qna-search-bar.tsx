'use client'

import { useRef, useActionState, useEffect, useState } from 'react'
import { searchQnaAction } from '@/app/actions/qna'
import type { QnaListItem, QnaStatusCount, QnaManhourInfo } from '@/lib/services/qna-service'

interface Props {
  onSearchResult: (
    items: QnaListItem[],
    statusCounts: QnaStatusCount,
    manhour: QnaManhourInfo | null,
  ) => void
  onNew: () => void
  formRef?: React.Ref<HTMLFormElement>
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export default function QnaSearchBar({ onSearchResult, onNew, formRef }: Props) {
  const innerRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(searchQnaAction, undefined)

  const [repFlags, setRepFlags] = useState({
    미답변: true,
    접수중: true,
    진행중: true,
    완료: false,
  })

  const [statusCounts, setStatusCounts] = useState<QnaStatusCount>({ NUM1: 0, NUM2: 0, NUM3: 0, NUM4: 0 })

  const setFormRef = (el: HTMLFormElement | null) => {
    (innerRef as React.MutableRefObject<HTMLFormElement | null>).current = el
    if (typeof formRef === 'function') formRef(el)
    else if (formRef && typeof formRef === 'object') (formRef as React.MutableRefObject<HTMLFormElement | null>).current = el
  }

  useEffect(() => {
    if (state?.items) {
      const counts = state.statusCounts || { NUM1: 0, NUM2: 0, NUM3: 0, NUM4: 0 }
      setStatusCounts(counts)
      onSearchResult(state.items, counts, state.manhour ?? null)
    }
  }, [state, onSearchResult])

  const toggleFlag = (flag: keyof typeof repFlags) => {
    setRepFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      innerRef.current?.requestSubmit()
    }
  }

  const now = new Date()
  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <form ref={setFormRef} action={formAction} className="flex flex-wrap items-center gap-2">
        {/* 날짜 범위 */}
        <input
          type="date"
          name="dateFrom"
          defaultValue={formatDate(twoMonthsAgo)}
          className="h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text-primary)]"
        />
        <span className="text-sm text-[var(--text-muted)]">~</span>
        <input
          type="date"
          name="dateTo"
          defaultValue={formatDate(now)}
          className="h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text-primary)]"
        />

        {/* 통합검색 */}
        <input
          type="text"
          name="keyword"
          placeholder="통합검색 (제목/내용/작성자)"
          onKeyDown={handleKeyDown}
          className="h-8 w-60 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />

        {/* 답변상태 필터 (hidden inputs) */}
        {repFlags.미답변 && <input type="hidden" name="repFlag" value="미답변" />}
        {repFlags.접수중 && <input type="hidden" name="repFlag" value="접수중" />}
        {repFlags.진행중 && <input type="hidden" name="repFlag" value="진행중" />}
        {repFlags.완료 && <input type="hidden" name="repFlag" value="완료" />}

        <button
          type="submit"
          disabled={isPending}
          className="h-8 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          {isPending ? '조회중...' : '조회'}
        </button>

        <button
          type="button"
          onClick={onNew}
          className="h-8 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          신규등록
        </button>
      </form>

      {/* 답변상태 체크박스 필터 */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusCheckbox
          label="미답변"
          count={statusCounts.NUM1}
          checked={repFlags.미답변}
          onChange={() => toggleFlag('미답변')}
          color="rose"
        />
        <StatusCheckbox
          label="접수중"
          count={statusCounts.NUM2}
          checked={repFlags.접수중}
          onChange={() => toggleFlag('접수중')}
          color="amber"
        />
        <StatusCheckbox
          label="진행중"
          count={statusCounts.NUM3}
          checked={repFlags.진행중}
          onChange={() => toggleFlag('진행중')}
          color="sky"
        />
        <StatusCheckbox
          label="완료"
          count={statusCounts.NUM4}
          checked={repFlags.완료}
          onChange={() => toggleFlag('완료')}
          color="emerald"
        />
      </div>

      {state?.error && (
        <span className="text-sm text-rose-500">{state.error}</span>
      )}
    </div>
  )
}

function StatusCheckbox({ label, count, checked, onChange, color }: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
  color: string
}) {
  const colorMap: Record<string, string> = {
    rose: 'accent-rose-500',
    amber: 'accent-amber-500',
    sky: 'accent-sky-500',
    emerald: 'accent-emerald-500',
  }

  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[var(--text-secondary)] select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-3.5 w-3.5 rounded ${colorMap[color] || ''}`}
      />
      <span>{label}</span>
      {count > 0 && (
        <span className="font-mono text-xs text-[var(--text-muted)]">({count.toLocaleString()})</span>
      )}
    </label>
  )
}
