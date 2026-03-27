'use client'

import type { ItemListItem } from '@/lib/services/item-service'

interface Props {
  items: ItemListItem[]
  selectedItemCd?: string
  onSelect: (itemCd: string) => void
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function Pagination({ page, pageSize, totalCount, onPageChange, onPageSizeChange }: {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const pages: (number | 'ellipsis')[] = []
  const addPage = (p: number) => {
    if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p)
  }

  addPage(1)
  if (page - 2 > 2) pages.push('ellipsis')
  for (let i = page - 2; i <= page + 2; i++) addPage(i)
  if (page + 2 < totalPages - 1) pages.push('ellipsis')
  addPage(totalPages)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm">
      <span className="text-[var(--text-secondary)]">
        전체 <strong className="text-[var(--text-primary)]">{totalCount.toLocaleString()}</strong>건
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded px-2 py-1 text-[var(--text-secondary)] hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-700"
          aria-label="이전 페이지"
        >
          ◀
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="px-1 text-[var(--text-muted)]">&hellip;</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] rounded px-1.5 py-1 ${
                p === page
                  ? 'bg-teal-600 font-medium text-white'
                  : 'text-[var(--text-secondary)] hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded px-2 py-1 text-[var(--text-secondary)] hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-700"
          aria-label="다음 페이지"
        >
          ▶
        </button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[var(--text-secondary)]">페이지당</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-1.5 py-1 text-sm text-[var(--text-primary)]"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  )
}

export default function ItemGrid({ items, selectedItemCd, onSelect, page, pageSize, totalCount, onPageChange, onPageSizeChange }: Props) {
  if (items.length === 0 && totalCount === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-[var(--text-muted)]">
        조회 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-stone-100 dark:bg-slate-800">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)]">품번</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)]">품명</th>
              <th className="hidden whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)] sm:table-cell">규격</th>
              <th className="hidden whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)] md:table-cell">단위</th>
              <th className="hidden whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)] md:table-cell">구분</th>
              <th className="hidden whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)] lg:table-cell">대분류</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-[var(--text-secondary)]">사용</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-right font-medium text-[var(--text-secondary)] md:table-cell">입고단가</th>
              <th className="hidden whitespace-nowrap px-3 py-2 text-right font-medium text-[var(--text-secondary)] lg:table-cell">판매단가</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {items.map((item) => (
              <tr
                key={item.K02JPMGBCD}
                onClick={() => onSelect(item.K02JPMGBCD)}
                className={`cursor-pointer transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/10 ${
                  selectedItemCd === item.K02JPMGBCD
                    ? 'bg-teal-50 dark:bg-teal-900/20'
                    : ''
                }`}
              >
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--text-secondary)]">{item.K02PUMGBN1}</td>
                <td className="max-w-[200px] truncate px-3 py-2 text-[var(--text-primary)]">{item.K02PUMGBN2}</td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-[var(--text-secondary)] sm:table-cell">{item.K02PUMGBN3}</td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-[var(--text-secondary)] md:table-cell">{item.K02SUBULUT}</td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-[var(--text-secondary)] md:table-cell">{item.K02CLASSCD_NM}</td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-[var(--text-secondary)] lg:table-cell">{item.K02GUBUN01_NM}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                    item.K02USEFLAG === 'Y'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                    {item.K02USEFLAG === 'Y' ? '사용' : '미사용'}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-right font-mono text-[var(--text-secondary)] md:table-cell">
                  {item.K02IPGPRC1 ? Number(item.K02IPGPRC1).toLocaleString() : ''}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-right font-mono text-[var(--text-secondary)] lg:table-cell">
                  {item.K02PANPRC1 ? Number(item.K02PANPRC1).toLocaleString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalCount > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}
