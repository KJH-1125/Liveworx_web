'use client'

import { useState, useCallback, useRef } from 'react'
import CustomerSearchBar from './customer-search-bar'
import CustomerGrid from './customer-grid'
import CustomerForm from './customer-form'
import { getCustomerDetail } from '@/app/actions/customer'
import type { CustomerListItem, CustomerDetail } from '@/lib/services/customer-service'

type Mode = 'view' | 'edit' | 'new'

export default function CustomerPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [selected, setSelected] = useState<CustomerDetail | null>(null)
  const [mode, setMode] = useState<Mode>('view')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const handleSearchResult = useCallback((list: CustomerListItem[], meta: { totalCount: number; page: number; pageSize: number }) => {
    setCustomers(list)
    setTotalCount(meta.totalCount)
    setPage(meta.page)
    setPageSize(meta.pageSize)
    setSelected(null)
    setMode('view')
  }, [])

  const handleSelect = useCallback(async (custCd: string) => {
    setLoading(true)
    try {
      const result = await getCustomerDetail(custCd)
      if (result.customer) {
        setSelected(result.customer)
        setMode('edit')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleNew = useCallback(() => {
    setSelected(null)
    setMode('new')
  }, [])

  const handleSaved = useCallback((custCd: string) => {
    handleSelect(custCd)
  }, [handleSelect])

  const submitWithPage = useCallback((newPage: number, newPageSize: number) => {
    const form = searchFormRef.current
    if (!form) return
    const pageInput = form.querySelector('input[name="page"]') as HTMLInputElement
    const sizeInput = form.querySelector('input[name="pageSize"]') as HTMLInputElement
    if (pageInput) pageInput.value = String(newPage)
    if (sizeInput) sizeInput.value = String(newPageSize)
    form.requestSubmit()
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    submitWithPage(newPage, pageSize)
  }, [pageSize, submitWithPage])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPage(1)
    setPageSize(newSize)
    submitWithPage(1, newSize)
  }, [submitWithPage])

  return (
    <div className="flex h-full flex-col gap-3">
      <CustomerSearchBar
        onSearchResult={handleSearchResult}
        onNew={handleNew}
        mode={mode}
        selectedCustCd={selected?.K01CUSGBCD}
        page={page}
        pageSize={pageSize}
        formRef={searchFormRef}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <div className="h-64 min-w-0 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:h-auto lg:flex-1">
          <CustomerGrid
            customers={customers}
            selectedCustCd={selected?.K01CUSGBCD}
            onSelect={handleSelect}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
        <div className="min-w-0 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
              로딩 중...
            </div>
          ) : mode === 'view' && !selected ? (
            <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
              거래처를 선택하거나 신규 등록하세요.
            </div>
          ) : (
            <CustomerForm
              customer={selected}
              mode={mode}
              onSaved={handleSaved}
            />
          )}
        </div>
      </div>
    </div>
  )
}
