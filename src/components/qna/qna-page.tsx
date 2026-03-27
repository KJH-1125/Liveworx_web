'use client'

import { useState, useCallback, useRef } from 'react'
import { useSession } from '@/contexts/session-context'
import QnaSearchBar from './qna-search-bar'
import QnaGrid from './qna-grid'
import QnaDetailPanel from './qna-detail'
import QnaManhourBar from './qna-manhour-bar'
import QnaWriteModal from './qna-write-modal'
import { getQnaDetailAction, deleteQnaAction } from '@/app/actions/qna'
import type { QnaListItem, QnaDetail, QnaStatusCount, QnaManhourInfo } from '@/lib/services/qna-service'

type ModalMode = 'new' | 'edit' | 'reply' | null

export default function QnaPage() {
  const session = useSession()

  const [items, setItems] = useState<QnaListItem[]>([])
  const [manhour, setManhour] = useState<QnaManhourInfo | null>(null)
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null)
  const [detail, setDetail] = useState<QnaDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const searchFormRef = useRef<HTMLFormElement>(null)

  const handleSearchResult = useCallback((
    newItems: QnaListItem[],
    _statusCounts: QnaStatusCount,
    newManhour: QnaManhourInfo | null,
  ) => {
    setItems(newItems)
    setManhour(newManhour)
    setSelectedSeq(null)
    setDetail(null)
    setMobileDetailOpen(false)
  }, [])

  const handleSelect = useCallback(async (seq: number) => {
    setSelectedSeq(seq)
    setLoading(true)
    setMobileDetailOpen(true)
    try {
      const result = await getQnaDetailAction(seq)
      if (result.detail) {
        setDetail(result.detail)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCloseMobileDetail = useCallback(() => {
    setMobileDetailOpen(false)
  }, [])

  const handleNew = useCallback(() => {
    setModalMode('new')
  }, [])

  const handleReply = useCallback(() => {
    if (detail) {
      setModalMode('reply')
    }
  }, [detail])

  const handleEdit = useCallback(() => {
    if (detail) {
      setModalMode('edit')
    }
  }, [detail])

  const handleDelete = useCallback(async () => {
    if (!detail) return
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    const result = await deleteQnaAction(detail.QNA_SEQ)
    if (result.success) {
      setDetail(null)
      setSelectedSeq(null)
      setMobileDetailOpen(false)
      searchFormRef.current?.requestSubmit()
    } else if (result.error) {
      alert(result.error)
    }
  }, [detail])

  const handleModalClose = useCallback(() => {
    setModalMode(null)
  }, [])

  const handleSaved = useCallback((seq: number) => {
    setModalMode(null)
    searchFormRef.current?.requestSubmit()
    handleSelect(seq)
  }, [handleSelect])

  const detailContent = loading ? (
    <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
      로딩 중...
    </div>
  ) : detail ? (
    <QnaDetailPanel
      detail={detail}
      currentUser={session?.userName || ''}
      onReply={handleReply}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ) : (
    <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
      게시글을 선택하거나 새 문의를 등록하세요.
    </div>
  )

  return (
    <div className="flex h-full flex-col gap-3">
      {/* 검색 영역 */}
      <QnaSearchBar
        onSearchResult={handleSearchResult}
        onNew={handleNew}
        formRef={searchFormRef}
      />

      {/* 공수 현황 */}
      {manhour && manhour.EXPDTTM && <QnaManhourBar manhour={manhour} />}

      {/* 본문: 그리드 + 상세 */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        {/* 그리드 - 모바일에서 전체 높이 사용 */}
        <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:flex-[1.2]">
          <QnaGrid
            items={items}
            selectedSeq={selectedSeq ?? undefined}
            onSelect={handleSelect}
          />
        </div>

        {/* 데스크톱 상세 패널 (lg 이상에서만 표시) */}
        <div className="hidden min-w-0 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:block lg:flex-1">
          {detailContent}
        </div>
      </div>

      {/* 모바일 상세 바텀시트 (lg 미만에서만 표시) */}
      {mobileDetailOpen && (detail || loading) && (
        <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
          {/* 백드롭 */}
          <div
            className="flex-shrink-0 bg-black/40"
            style={{ height: '15%' }}
            onClick={handleCloseMobileDetail}
          />
          {/* 바텀시트 */}
          <div className="flex flex-1 flex-col rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            {/* 핸들바 + 닫기 */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
              <button
                type="button"
                onClick={handleCloseMobileDetail}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-stone-100 dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            {/* 상세 내용 */}
            <div className="min-h-0 flex-1 overflow-auto">
              {detailContent}
            </div>
          </div>
        </div>
      )}

      {/* 등록/수정/답글 모달 */}
      {modalMode === 'new' && (
        <QnaWriteModal
          mode="new"
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
      {modalMode === 'edit' && detail && (
        <QnaWriteModal
          mode="edit"
          detail={detail}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
      {modalMode === 'reply' && detail && (
        <QnaWriteModal
          mode="reply"
          parentSeq={detail.QNA_SEQ}
          parentTitle={detail.QNA_TITLE}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
