import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import FadeIn from './FadeIn'
import GlassPlate from './GlassPlate'
import { prefersReducedMotion } from '../lib/motion'
import { isRecent } from '../lib/dates'

const pillBase = {
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.04em',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease, color 0.2s ease',
  whiteSpace: 'nowrap',
}

function FilterPill({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      data-hover
      style={{
        ...pillBase,
        fontSize: '0.65rem',
        padding: '0.3rem 0.7rem',
        background: active ? 'var(--mocha)' : 'var(--tag-bg)',
        color: active ? 'var(--bg-primary)' : 'var(--tag-text)',
      }}
    >
      {label} <span style={{ opacity: 0.6, marginLeft: '0.3rem' }}>({count})</span>
    </button>
  )
}

function CollapsedContent({ entry, hovered, onTagClick }) {
  const bodyRef = useRef(null)
  const [overflows, setOverflows] = useState(false)

  useLayoutEffect(() => {
    if (!bodyRef.current || !entry.body) return
    const el = bodyRef.current
    setOverflows(el.scrollHeight - 1 > el.clientHeight)
  }, [entry.body])

  const fresh = isRecent(entry.date)

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.4rem',
      }}>
        <p className="mono" style={{
          fontSize: '0.55rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}>
          {entry.date}
        </p>
        {fresh && <span className="new-badge">new</span>}
      </div>
      <h2 style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        marginBottom: '0.5rem',
        color: hovered ? 'var(--mocha)' : 'var(--text-primary)',
        transition: 'color 0.2s ease',
      }}>
        {entry.title}
      </h2>
      {entry.body && (
        <>
          <div
            ref={bodyRef}
            className="diary-body"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: overflows ? '0.4rem' : '0',
            }}
            dangerouslySetInnerHTML={{ __html: entry.bodyHtml || '' }}
          />
          {overflows && (
            <span className="mono" style={{
              fontSize: '0.6rem',
              color: hovered ? 'var(--mocha)' : 'var(--text-muted)',
              letterSpacing: '0.04em',
              transition: 'color 0.2s ease',
            }}>
              Read more →
            </span>
          )}
        </>
      )}
      {entry.tags?.length > 0 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem',
            marginTop: '0.7rem',
            paddingTop: '0.7rem',
            borderTop: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          {entry.tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              data-hover
              style={{
                ...pillBase,
                fontSize: '0.5rem',
                padding: '0.12rem 0.5rem',
                background: 'var(--tag-bg)',
                color: 'var(--tag-text)',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function ExpandedContent({ entry, onTagClick }) {
  const fresh = isRecent(entry.date)
  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.4rem',
      }}>
        <p className="mono" style={{
          fontSize: '0.55rem',
          color: 'var(--mocha)',
          letterSpacing: '0.1em',
        }}>
          {entry.date}
        </p>
        {fresh && <span className="new-badge">new</span>}
      </div>
      <h2 style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        marginBottom: '0.5rem',
        color: 'var(--mocha)',
      }}>
        {entry.title}
      </h2>
      {entry.body && (
        <div
          className="diary-body"
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
          }}
          dangerouslySetInnerHTML={{ __html: entry.bodyHtml || '' }}
        />
      )}
      {entry.tags?.length > 0 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem',
            marginTop: '0.7rem',
            paddingTop: '0.7rem',
            borderTop: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          {entry.tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              data-hover
              style={{
                ...pillBase,
                fontSize: '0.5rem',
                padding: '0.12rem 0.5rem',
                background: 'var(--tag-bg)',
                color: 'var(--tag-text)',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function DiaryCard({ entry, expanded, onToggle, onTagClick }) {
  const [hovered, setHovered] = useState(false)

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  const transitionName = `diary-${entry.date.replaceAll('.', '-')}`

  return (
    <div
      className={expanded ? 'diary-card-vt diary-card expanded' : 'diary-card-vt diary-card'}
      style={{
        viewTransitionName: transitionName,
      }}
      onMouseEnter={() => !expanded && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GlassPlate
        id={entry.date}
        role={expanded ? undefined : 'button'}
        tabIndex={expanded ? -1 : 0}
        onClick={expanded ? undefined : onToggle}
        onKeyDown={expanded ? undefined : handleKey}
        data-hover={expanded ? undefined : ''}
        style={{
          padding: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          cursor: expanded ? 'default' : 'pointer',
          transition: 'transform 0.2s ease',
          transform: !expanded && hovered ? 'translateY(-2px)' : 'translateY(0)',
          ...(expanded ? {
            background: 'rgba(14, 10, 8, 0.96)',
            border: '1px solid rgba(245, 238, 229, 0.30)',
            boxShadow: `
              0 0 24px rgba(245, 238, 229, 0.22),
              0 0 60px rgba(245, 238, 229, 0.13),
              0 0 120px rgba(245, 238, 229, 0.08),
              0 8px 40px rgba(0,0,0,0.35),
              0 1px 0 rgba(255,255,255,0.04) inset
            `,
          } : null),
        }}
      >
        {expanded ? (
          <ExpandedContent entry={entry} onTagClick={onTagClick} />
        ) : (
          <CollapsedContent entry={entry} hovered={hovered} onTagClick={onTagClick} />
        )}
      </GlassPlate>
    </div>
  )
}

function getInitialColumnCount() {
  if (typeof window === 'undefined') return 3
  const w = window.innerWidth
  if (w <= 640) return 1
  if (w <= 1024) return 2
  return 3
}

function readUrlParam(key) {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(key)
}

export default function DiaryPage({ diary }) {
  const [activeTag, setActiveTag] = useState(() => readUrlParam('tag'))
  const [openDate, setOpenDate] = useState(() => readUrlParam('open'))
  const [columnCount, setColumnCount] = useState(getInitialColumnCount)

  // ブラウザ戻る/進む
  useEffect(() => {
    const onPop = () => {
      setActiveTag(readUrlParam('tag'))
      setOpenDate(readUrlParam('open'))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const next = w <= 640 ? 1 : w <= 1024 ? 2 : 3
      setColumnCount(prev => (prev === next ? prev : next))
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const sorted = useMemo(
    () => [...diary].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [diary]
  )

  const tagCounts = useMemo(() => {
    const m = new Map()
    for (const entry of sorted) {
      for (const t of entry.tags ?? []) {
        m.set(t, (m.get(t) ?? 0) + 1)
      }
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [sorted])

  const entries = activeTag
    ? sorted.filter(e => e.tags?.includes(activeTag))
    : sorted

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => [])
    entries.forEach((entry, i) => {
      cols[i % columnCount].push(entry)
    })
    return cols
  }, [entries, columnCount])

  // URL を mutator で書き換えつつ React state も同期。replace か push か選べる。
  const updateUrl = (mutator, opts = { replace: true }) => {
    const url = new URL(window.location.href)
    mutator(url.searchParams)
    if (opts.replace) {
      window.history.replaceState({}, '', url)
    } else {
      window.history.pushState({}, '', url)
    }
    const apply = () => {
      setActiveTag(url.searchParams.get('tag'))
      setOpenDate(url.searchParams.get('open'))
    }
    if (
      typeof document !== 'undefined' &&
      document.startViewTransition &&
      !prefersReducedMotion()
    ) {
      const t = document.startViewTransition(() => flushSync(apply))
      return t.finished
    }
    apply()
    return Promise.resolve()
  }

  const setTag = (tag) => {
    updateUrl((p) => {
      if (tag) p.set('tag', tag)
      else p.delete('tag')
      p.delete('open')
    })
  }

  const toggleOpen = (entry) => {
    const isOpen = openDate === entry.date
    updateUrl((p) => {
      if (isOpen) p.delete('open')
      else p.set('open', entry.date)
    })
  }

  // 着地時の scroll 位置
  useEffect(() => {
    if (!openDate) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const el = document.getElementById(openDate)
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Esc / 外側クリック で閉じる
  useEffect(() => {
    if (!openDate) return

    const closeOpen = () => {
      updateUrl((p) => p.delete('open'), { replace: true })
    }

    const onKey = (e) => {
      if (e.key === 'Escape') closeOpen()
    }

    const onMouseDown = (e) => {
      if (e.target.closest('.diary-card-vt')) return
      closeOpen()
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onMouseDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDate])

  return (
    <main style={{
      padding: 'var(--page-pad-top) 2rem var(--page-pad-bottom)',
      minHeight: '100vh',
    }}>
      <div style={{
        maxWidth: 1300,
        margin: '0 auto 2rem auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
      }}>
        <FilterPill
          label="All"
          count={sorted.length}
          active={!activeTag}
          onClick={() => setTag(null)}
        />
        {tagCounts.map(([tag, count]) => (
          <FilterPill
            key={tag}
            label={`#${tag}`}
            count={count}
            active={activeTag === tag}
            onClick={() => setTag(tag)}
          />
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="mono" style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          letterSpacing: '0.06em',
          marginTop: '3rem',
        }}>
          該当する Diary はありません
        </p>
      ) : (
        <div className="diary-grid" style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}>
          {columns.map((col, ci) => (
            <div key={ci} className="diary-col">
              {col.map((entry) => (
                <FadeIn key={entry.date}>
                  <DiaryCard
                    entry={entry}
                    expanded={openDate === entry.date}
                    onToggle={() => toggleOpen(entry)}
                    onTagClick={setTag}
                  />
                </FadeIn>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .diary-grid {
          display: grid;
          gap: 1.5rem;
          max-width: 1300px;
          margin: 0 auto;
          align-items: start;
        }
        .diary-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 0;
        }

        @supports (view-transition-class: a) {
          .diary-card-vt {
            view-transition-class: diary;
          }
          ::view-transition-group(.diary) {
            animation-duration: 0.5s;
            animation-timing-function: cubic-bezier(0.34, 1.18, 0.64, 1);
          }
          ::view-transition-old(.diary),
          ::view-transition-new(.diary) {
            animation-duration: 0.5s;
            animation-timing-function: cubic-bezier(0.34, 1.18, 0.64, 1);
          }
        }
        @supports (view-transition-name: a) {
          ::view-transition-group(root) {
            animation-duration: 0.4s;
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          }
        }
      `}</style>
    </main>
  )
}
