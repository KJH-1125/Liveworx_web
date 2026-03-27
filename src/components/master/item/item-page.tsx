'use client'

import { useState, useCallback, useRef } from 'react'
import ItemSearchBar from './item-search-bar'
import ItemGrid from './item-grid'
import ItemForm from './item-form'
import { getItemDetail, deleteItemAction } from '@/app/actions/item'
import type { ItemListItem, ItemDetail } from '@/lib/services/item-service'

type Mode = 'view' | 'edit' | 'new'

export default function ItemPage() {
  const [items, setItems] = useState<ItemListItem[]>([])
  const [selected, setSelected] = useState<ItemDetail | null>(null)
  const [mode, setMode] = useState<Mode>('view')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const handleSearchResult = useCallback((list: ItemListItem[], meta: { totalCount: number; page: number; pageSize: number }) => {
    setItems(list)
    setTotalCount(meta.totalCount)
    setPage(meta.page)
    setPageSize(meta.pageSize)
    setSelected(null)
    setMode('view')
  }, [])

  const handleSelect = useCallback(async (itemCd: string) => {
    setLoading(true)
    try {
      const result = await getItemDetail(itemCd)
      if (result.item) {
        setSelected(result.item)
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

  const handleSaved = useCallback((itemCd: string) => {
    handleSelect(itemCd)
  }, [handleSelect])

  const handleDelete = useCallback(async () => {
    if (!selected?.K02JPMGBCD) return
    if (!confirm('정말 삭제하시겠습니까?')) return

    setLoading(true)
    try {
      const result = await deleteItemAction(selected.K02JPMGBCD)
      if (result.success) {
        setSelected(null)
        setMode('view')
        // 재조회
        const form = searchFormRef.current
        if (form) form.requestSubmit()
      } else if (result.error) {
        alert(result.error)
      }
    } finally {
      setLoading(false)
    }
  }, [selected])

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
      <ItemSearchBar
        onSearchResult={handleSearchResult}
        onNew={handleNew}
        onDelete={handleDelete}
        mode={mode}
        selectedItemCd={selected?.K02JPMGBCD}
        page={page}
        pageSize={pageSize}
        formRef={searchFormRef}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <div className="h-64 min-w-0 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:h-auto lg:flex-1">
          <ItemGrid
            items={items}
            selectedItemCd={selected?.K02JPMGBCD}
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
              제품을 선택하거나 신규 등록하세요.
            </div>
          ) : (
            <ItemForm
              item={selected}
              mode={mode}
              onSaved={handleSaved}
            />
          )}
        </div>
      </div>
    </div>
  )
}
