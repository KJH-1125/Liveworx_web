'use client'

import { useMemo } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import type { QnaDetail } from '@/lib/services/qna-service'

/** Infragistics UltraFormattedTextEditor HTML을 브라우저용으로 정리 */
function sanitizeRtfHtml(raw: string): string {
  // &edsp; 는 Infragistics 전용 엔티티 → em space로 변환
  let html = raw.replace(/&edsp;/g, '\u2003')
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'span', 'b', 'i', 'u', 'strong', 'em', 'img', 'div', 'a', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'hr', 'font', 'sub', 'sup'],
    ALLOWED_ATTR: ['style', 'src', 'alt', 'width', 'height', 'href', 'target', 'color', 'size', 'face', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: false,
  })
}

interface Props {
  detail: QnaDetail
  currentUser: string
  onReply: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function QnaDetailPanel({ detail, currentUser, onReply, onEdit, onDelete }: Props) {
  const isOwner = detail.QNA_UPDUSERID === currentUser
  const sanitizedHtml = useMemo(
    () => detail.QNA_RTF ? sanitizeRtfHtml(detail.QNA_RTF) : null,
    [detail.QNA_RTF]
  )

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
          {detail.QNA_TITLE}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            {detail.QNA_UPDUSERID}
          </span>
          <span>{detail.QNA_UPDDTTM}</span>
          {detail.QNA_EMAIL && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              {detail.QNA_EMAIL}
            </span>
          )}
          {detail.QNA_TEL && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="m3.855 7.286 1.067-.534a1 1 0 0 0 .542-1.046l-.44-2.858A1 1 0 0 0 4.036 2H3a1 1 0 0 0-1 1v2c0 .709.082 1.4.238 2.062a9.012 9.012 0 0 0 6.7 6.7A9.024 9.024 0 0 0 11 14h2a1 1 0 0 0 1-1v-1.036a1 1 0 0 0-.848-.988l-2.858-.44a1 1 0 0 0-1.046.542l-.534 1.067a7.52 7.52 0 0 1-4.86-4.859Z" clipRule="evenodd" />
              </svg>
              {detail.QNA_TEL}
            </span>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
        {sanitizedHtml ? (
          <div
            className="qna-rtf-content text-sm leading-relaxed text-[var(--text-primary)]"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
            {detail.QNA_CONTS}
          </div>
        )}

        {/* 관리자 답변 */}
        {detail.QNA_REPCONTENTS && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-teal-700 dark:text-teal-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M1 8.74c0 .983.713 1.825 1.69 1.943.764.092 1.534.164 2.31.216v2.351a.75.75 0 0 0 1.28.53l2.51-2.51c.182-.181.427-.29.685-.306A41.4 41.4 0 0 0 14.31 10.5C15.287 10.283 16 9.54 16 8.558V4.806c0-.983-.713-1.825-1.69-1.943A44.234 44.234 0 0 0 8 2.5a44.234 44.234 0 0 0-6.31.363C.713 2.98 0 3.823 0 4.806v3.934h1Z" clipRule="evenodd" />
              </svg>
              답변 ({detail.QNA_REPNAME} / {detail.QNA_REPDTTM})
            </div>
            <div className="whitespace-pre-wrap text-sm text-[var(--text-primary)]">
              {detail.QNA_REPCONTENTS}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-2.5">
        <button
          type="button"
          onClick={onReply}
          className="h-8 rounded-lg bg-sky-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          답글
        </button>
        {isOwner && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="h-8 rounded-lg bg-amber-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="h-8 rounded-lg bg-rose-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
            >
              삭제
            </button>
          </>
        )}
        {detail.ATTACH_GRPNO && detail.ATTACH_GRPNO !== '0' && (
          <span className="ml-auto flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
            </svg>
            첨부파일 있음
          </span>
        )}
      </div>

      <style>{`
        .qna-rtf-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 4px 0;
        }
        .qna-rtf-content p {
          margin: 0 0 0.5em;
        }
      `}</style>
    </div>
  )
}
