'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTab } from '@/contexts/tab-context'

export default function TabBar() {
  const { tabs, activeTabId, activateTab, closeTab, closeOtherTabs, closeAllTabs } = useTab()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      ro.disconnect()
    }
  }, [checkScroll, tabs])

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (!activeTabId || !scrollRef.current) return
    const el = scrollRef.current.querySelector(`[data-tab-id="${CSS.escape(activeTabId)}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [activeTabId])

  // Close context menu on click outside
  useEffect(() => {
    if (!contextMenu) return
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [contextMenu])

  if (tabs.length === 0) return null

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="tab-bar-wrapper">
      {/* Scroll fade left */}
      {canScrollLeft && (
        <button className="tab-scroll-btn tab-scroll-left" onClick={() => scroll('left')} aria-label="스크롤 왼쪽">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
        </button>
      )}

      {/* Tab strip */}
      <div ref={scrollRef} className="tab-scroll-area">
        {tabs.map((tab, i) => {
          const isActive = tab.id === activeTabId
          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              className={`tab-item ${isActive ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => activateTab(tab.id)}
              onAuxClick={e => { if (e.button === 1) { e.preventDefault(); closeTab(tab.id) } }}
              onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id }) }}
            >
              {/* Left slant connector — only for active tab */}
              {isActive && <div className="tab-connector-left" />}

              {/* Accent indicator */}
              {isActive && <span className="tab-accent-line" />}

              <span className="tab-label">{tab.label}</span>

              <button
                className={`tab-close ${isActive ? 'tab-close-visible' : ''}`}
                onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                title="닫기"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l6 6M8 2l-6 6"/>
                </svg>
              </button>

              {/* Right slant connector — only for active tab */}
              {isActive && <div className="tab-connector-right" />}
            </div>
          )
        })}
      </div>

      {/* Scroll fade right */}
      {canScrollRight && (
        <button className="tab-scroll-btn tab-scroll-right" onClick={() => scroll('right')} aria-label="스크롤 오른쪽">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
        </button>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="tab-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => { closeTab(contextMenu.tabId); setContextMenu(null) }}>
            탭 닫기
          </button>
          <button onClick={() => { closeOtherTabs(contextMenu.tabId); setContextMenu(null) }}>
            다른 탭 모두 닫기
          </button>
          <div className="tab-context-divider" />
          <button onClick={() => { closeAllTabs(); setContextMenu(null) }}>
            모든 탭 닫기
          </button>
        </div>
      )}

      <style>{`
        .tab-bar-wrapper {
          position: relative;
          display: flex;
          align-items: flex-end;
          height: 36px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          user-select: none;
          flex-shrink: 0;
        }

        .tab-scroll-area {
          display: flex;
          align-items: flex-end;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1;
          padding-left: 2px;
        }
        .tab-scroll-area::-webkit-scrollbar { display: none; }

        .tab-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 12px 0 14px;
          margin-bottom: -1px;
          font-size: 12.5px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 6px 6px 0 0;
          transition: background 0.15s, color 0.15s;
        }

        .tab-active {
          color: var(--text-primary);
          background: var(--background);
          border: 1px solid var(--border);
          border-bottom-color: var(--background);
          font-weight: 500;
          z-index: 2;
        }

        .tab-inactive {
          color: var(--text-secondary);
          border: 1px solid transparent;
          border-bottom: none;
        }
        .tab-inactive:hover {
          color: var(--text-primary);
          background: var(--surface-hover);
        }

        .tab-accent-line {
          position: absolute;
          top: 0;
          left: 8px;
          right: 8px;
          height: 2px;
          background: var(--accent);
          border-radius: 0 0 2px 2px;
        }

        .tab-label {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 4px;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.12s, background 0.12s, color 0.12s;
          flex-shrink: 0;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
        }
        .tab-close:hover {
          background: var(--border);
          color: var(--text-primary);
        }
        .tab-close-visible {
          opacity: 1;
        }
        .tab-item:hover .tab-close {
          opacity: 1;
        }

        /* Scroll buttons */
        .tab-scroll-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 100%;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
          flex-shrink: 0;
          z-index: 3;
          transition: color 0.15s;
          padding: 0;
        }
        .tab-scroll-btn:hover {
          color: var(--text-primary);
        }
        .tab-scroll-left {
          box-shadow: 4px 0 8px -2px rgba(0,0,0,0.06);
        }
        .tab-scroll-right {
          box-shadow: -4px 0 8px -2px rgba(0,0,0,0.06);
        }
        .dark .tab-scroll-left {
          box-shadow: 4px 0 8px -2px rgba(0,0,0,0.25);
        }
        .dark .tab-scroll-right {
          box-shadow: -4px 0 8px -2px rgba(0,0,0,0.25);
        }

        /* Context menu */
        .tab-context-menu {
          position: fixed;
          z-index: 100;
          min-width: 160px;
          padding: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: var(--shadow-md);
        }
        .tab-context-menu button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 6px 10px;
          font-size: 12.5px;
          color: var(--text-secondary);
          border: none;
          background: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
        }
        .tab-context-menu button:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .tab-context-divider {
          height: 1px;
          margin: 4px 6px;
          background: var(--border);
        }
      `}</style>
    </div>
  )
}
