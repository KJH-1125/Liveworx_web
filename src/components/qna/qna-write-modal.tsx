'use client'

import { useRef, useActionState, useEffect } from 'react'
import { createQnaAction, updateQnaAction } from '@/app/actions/qna'
import type { QnaDetail } from '@/lib/services/qna-service'

interface Props {
  mode: 'new' | 'edit' | 'reply'
  detail?: QnaDetail | null       // edit 시 기존 데이터
  parentSeq?: number               // reply 시 부모 SEQ
  parentTitle?: string             // reply 시 부모 제목
  defaultEmail?: string
  onClose: () => void
  onSaved: (seq: number) => void
}

export default function QnaWriteModal({ mode, detail, parentSeq, parentTitle, defaultEmail, onClose, onSaved }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const action = mode === 'edit' ? updateQnaAction : createQnaAction
  const [state, formAction, isPending] = useActionState(action, undefined)

  useEffect(() => {
    if (state?.success && state.seq) {
      onSaved(state.seq)
    }
  }, [state, onSaved])

  const title = mode === 'new' ? '새 문의 등록' : mode === 'edit' ? '문의 수정' : '답글 작성'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-stone-100 dark:hover:bg-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* reply 안내 */}
        {mode === 'reply' && parentTitle && (
          <div className="border-b border-[var(--border)] bg-sky-50/50 px-5 py-2 text-xs text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
            원글: {parentTitle}
          </div>
        )}

        {/* 폼 */}
        <form ref={formRef} action={formAction} className="flex min-h-0 flex-1 flex-col overflow-auto">
          {mode === 'edit' && <input type="hidden" name="seq" value={detail?.QNA_SEQ} />}
          {mode === 'reply' && <input type="hidden" name="parentSeq" value={parentSeq || 0} />}
          {mode === 'new' && <input type="hidden" name="parentSeq" value="0" />}
          <input type="hidden" name="gbn" value="QNA" />

          <div className="flex flex-col gap-3 p-5">
            {/* 제목 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={mode === 'edit' ? detail?.QNA_TITLE : mode === 'reply' ? `RE: ${parentTitle}` : ''}
                required
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                placeholder="문의 제목을 입력하세요"
              />
            </div>

            {/* 이메일 / 연락처 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">이메일</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={mode === 'edit' ? detail?.QNA_EMAIL : defaultEmail}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">연락처</label>
                <input
                  type="tel"
                  name="tel"
                  defaultValue={mode === 'edit' ? detail?.QNA_TEL : ''}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)]"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* 내용 */}
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="content"
                defaultValue={mode === 'edit' ? detail?.QNA_CONTS : ''}
                required
                rows={10}
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                placeholder="문의 내용을 입력하세요"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {state?.error && (
            <div className="px-5 pb-2">
              <p className="text-sm text-rose-500">{state.error}</p>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-stone-100 dark:hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-8 rounded-lg bg-teal-600 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
            >
              {isPending ? '저장중...' : mode === 'edit' ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
