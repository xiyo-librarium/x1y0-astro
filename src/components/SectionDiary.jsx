import { useState } from 'react'
import FadeIn from './FadeIn'
import GlassPlate from './GlassPlate'
import SectionKicker from './SectionKicker'

const MAX_PREVIEW = 3

function DiaryRow({ entry }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'padding-left 0.2s ease',
        paddingLeft: hovered ? '0.5rem' : '0',
      }}
    >
      <a
        href={`/diary?open=${encodeURIComponent(entry.date)}`}
        data-hover
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          padding: '1.2rem 0',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem',
        }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: hovered ? 'var(--mocha)' : 'var(--text-primary)',
            transition: 'color 0.2s ease',
          }}>
            {entry.title}
          </h3>
          <span className="mono" style={{
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            flexShrink: 0,
            marginLeft: '1rem',
          }}>
            {entry.date}
          </span>
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          whiteSpace: 'pre-line',
        }}>
          {entry.body}
        </p>
      </a>
    </div>
  )
}

export default function SectionDiary({ diary }) {
  const preview = diary.slice(0, MAX_PREVIEW)

  return (
    <section
      id="diary"
      style={{
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem var(--page-pad-bottom)',
      }}
    >
      <FadeIn>
        <GlassPlate className="plate-width" style={{
          padding: 'clamp(2rem, 5vw, 3rem)',
        }}>
          <SectionKicker href="/diary">03 / diary</SectionKicker>

          <div>
            {preview.map((entry, i) => (
              <DiaryRow key={i} entry={entry} />
            ))}
          </div>

          <div style={{ paddingTop: '1.2rem', textAlign: 'right' }}>
            <a href="/diary" data-hover className="text-link">Read more →</a>
          </div>
        </GlassPlate>
      </FadeIn>
    </section>
  )
}
