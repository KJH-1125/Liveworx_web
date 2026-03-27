'use client'

import { useRef, useActionState, useEffect } from 'react'
import { searchCustomersAction } from '@/app/actions/customer'
import type { CustomerListItem } from '@/lib/services/customer-service'

interface PagingMeta {
  totalCount: number
  page: number
  pageSize: number
}

interface Props {
  onSearchResult: (list: CustomerListItem[], meta: PagingMeta) => void
  onNew: () => void
  mode: 'view' | 'edit' | 'new'
  selectedCustCd?: string
  page: number
  pageSize: number
  formRef?: React.Ref<HTMLFormElement>
}

export default function CustomerSearchBar({ onSearchResult, onNew, mode, selectedCustCd, page, pageSize, formRef }: Props) {
  const innerRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(searchCustomersAction, undefined)

  // Merge refs
  const setFormRef = (el: HTMLFormElement | null) => {
    (innerRef as React.MutableRefObject<HTMLFormElement | null>).current = el
    if (typeof formRef === 'function') formRef(el)
    else if (formRef && typeof formRef === 'object') (formRef as React.MutableRefObject<HTMLFormElement | null>).current = el
  }

  useEffect(() => {
    if (state?.customers) {
      onSearchResult(state.customers, {
        totalCount: state.totalCount ?? 0,
        page: state.page ?? 1,
        pageSize: state.pageSize ?? 20,
      })
    }
  }, [state, onSearchResult])

  const handleSearchClick = () => {
    const form = innerRef.current
    if (form) {
      const pageInput = form.querySelector('input[name="page"]') as HTMLInputElement
      if (pageInput) pageInput.value = '1'
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <form ref={setFormRef} action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="page" defaultValue={page} />
        <input type="hidden" name="pageSize" defaultValue={pageSize} />
        <input
          type="text"
          name="keyword"
          placeholder="코드/상호/대표자/사업자번호"
          className="h-8 w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <select
          name="useFlag"
          defaultValue=""
          className="h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm text-[var(--text-primary)]"
        >
          <option value="">전체</option>
          <option value="N">사용</option>
          <option value="Y">삭제</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          onClick={handleSearchClick}
          className="h-8 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          {isPending ? '조회중...' : '조회'}
        </button>
      </form>
      <button
        type="button"
        onClick={onNew}
        className="h-8 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        신규
      </button>
      {(mode === 'edit' || mode === 'new') && (
        <button
          type="submit"
          form="customer-form"
          className="h-8 rounded-lg bg-amber-600 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          저장
        </button>
      )}
      {state?.error && (
        <span className="text-sm text-rose-500">{state.error}</span>
      )}
    </div>
  )
}
