'use client'

import type { QnaListItem } from '@/lib/services/qna-service'

interface Props {
  items: QnaListItem[]
  selectedSeq?: number
  onSelect: (seq: number) => void
}

function RepFlagBadge({ flag }: { flag: string }) {
  const styles: Record<string, string> = {
    '미답변': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    '접수중': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    '진행중': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    '완료': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  }

  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${styles[flag] || 'bg-stone-100 text-stone-600 dark:bg-slate-700 dark:text-slate-300'}`}>
      {flag || '-'}
    </span>
  )
}

export default function QnaGrid({ items, selectedSeq, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
        조회 결과가 없습니다. 조회 버튼을 눌러주세요.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-stone-100 dark:bg-slate-800">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 text-center font-medium text-[var(--text-secondary)]" style={{ width: 60 }}>번호</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)]">제목</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-center font-medium text-[var(--text-secondary)] md:table-cell" style={{ width: 80 }}>답변상태</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-center font-medium text-[var(--text-secondary)] sm:table-cell" style={{ width: 90 }}>작성자</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-center font-medium text-[var(--text-secondary)] lg:table-cell" style={{ width: 140 }}>작성시간</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-center font-medium text-[var(--text-secondary)] lg:table-cell" style={{ width: 50 }}>파일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {items.map((item) => {
              const isPinned = item.QNA_FIXYN === 'Y'
              const isReply = item.LV > 0
              const isSelected = selectedSeq === item.QNA_SEQ

              return (
                <tr
                  key={item.QNA_SEQ}
                  onClick={() => onSelect(item.QNA_SEQ)}
                  className={`cursor-pointer transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/10 ${
                    isSelected ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                  } ${isPinned ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                >
                  <td className="whitespace-nowrap px-3 py-2 text-center font-mono text-xs text-[var(--text-muted)]">
                    {isPinned ? (
                      <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                        공지
                      </span>
                    ) : (
                      item.QNA_SEQ
                    )}
                  </td>
                  <td className="max-w-[300px] truncate px-3 py-2 text-[var(--text-primary)]">
                    {isPinned && (
                      <span className="mr-1 font-bold text-amber-600 dark:text-amber-400">[공지사항]</span>
                    )}
                    <span className={isPinned ? 'font-semibold' : isReply ? 'text-[var(--text-secondary)]' : ''}>
                      {item.QNA_TITLE}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-center md:table-cell">
                    {!isPinned && <RepFlagBadge flag={item.QNA_REPFLAG} />}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-center text-[var(--text-secondary)] sm:table-cell">
                    {item.QNA_UPDUSERID}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-center font-mono text-xs text-[var(--text-muted)] lg:table-cell">
                    {item.QNA_INSDTTM}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-center lg:table-cell">
                    {item.QNA_FILE && item.QNA_FILE !== '0' && (
                      <span className="text-teal-600 dark:text-teal-400" title="첨부파일 있음">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto h-4 w-4">
                          <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm text-[var(--text-secondary)]">
        전체 <strong className="text-[var(--text-primary)]">{items.filter(i => i.QNA_FIXYN !== 'Y' && i.QNA_PARENT === 0).length}</strong>건
      </div>
    </div>
  )
}
