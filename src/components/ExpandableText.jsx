import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const toggleStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.65rem',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: '1px solid rgba(164,119,100,0.15)',
  paddingBottom: '1px',
  cursor: 'pointer',
  marginTop: '0.5rem',
  transition: 'color 0.2s ease',
}

export default function ExpandableText({ text, lines = 4, style }) {
  const ref = useRef(null)
  const [needsToggle, setNeedsToggle] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useLayoutEffect(() => {
    if (!text || !ref.current) return
    // 一度クランプ状態のサイズを測って、scrollHeight が clientHeight を超えるなら toggle 表示
    const el = ref.current
    setNeedsToggle(el.scrollHeight - 1 > el.clientHeight)
  }, [text, lines])

  useEffect(() => {
    if (!needsToggle) return
    const onResize = () => {
      if (!ref.current) return
      // 展開中はチェック不要（必ず toggle を出す）
      if (expanded) return
      const el = ref.current
      setNeedsToggle(el.scrollHeight - 1 > el.clientHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [needsToggle, expanded])

  if (!text) return null

  const clampStyle = !expanded
    ? {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {}

  return (
    <div>
      <p
        ref={ref}
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          whiteSpace: 'pre-line',
          ...clampStyle,
          ...style,
        }}
      >
        {text}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          data-hover
          style={toggleStyle}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--mocha)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
