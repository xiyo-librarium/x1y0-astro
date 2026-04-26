import { useEffect } from 'react'
import ExpandableText from './ExpandableText'
import FadeIn from './FadeIn'
import GlassPlate from './GlassPlate'
import { statusStyle } from '../lib/projectStatus'

const sectionLabelStyle = {
  fontSize: '0.6rem',
  color: 'var(--mocha)',
  letterSpacing: '0.2em',
  marginBottom: '0.6rem',
}

function latestUpdateDate(updates) {
  if (!updates?.length) return null
  return [...updates].sort((a, b) => (a.date < b.date ? 1 : -1))[0].date
}

function ProjectPlate({ project, diary }) {
  const st = statusStyle[project.status]
  const updatedAt = latestUpdateDate(project.updates)
  const heroSrc = project.screenshots?.[0]
  const restScreenshots = project.screenshots?.slice(1) ?? []
  const relatedDiary = diary.filter(d => d.tags?.includes(project.slug))

  return (
    <FadeIn>
      <GlassPlate
        id={project.slug}
        style={{
          padding: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          scrollMarginTop: '5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        {heroSrc && (
          <img
            src={heroSrc}
            alt={project.title}
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'block',
            }}
          />
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.8rem',
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}>
            {project.title}
          </h2>
          <span className="mono" style={{
            fontSize: '0.5rem',
            padding: '0.15rem 0.4rem',
            border: `1px solid ${st.color}`,
            borderRadius: '2px',
            color: st.color,
            letterSpacing: '0.1em',
            opacity: 0.95,
            flexShrink: 0,
          }}>
            {st.label}
          </span>
        </div>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {project.desc}
        </p>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span key={tag} className="tag-pill" style={{ fontSize: '0.55rem' }}>{tag}</span>
          ))}
        </div>

        <div className="mono" style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          <span>公開: {project.date}</span>
          {updatedAt && <span>更新: {updatedAt}</span>}
        </div>

        {project.longDesc && (
          <ExpandableText text={project.longDesc} lines={4} />
        )}

        {project.story && (
          <div>
            <p className="mono" style={sectionLabelStyle}>dev story</p>
            <ExpandableText text={project.story} lines={4} />
          </div>
        )}

        {restScreenshots.length > 0 && (
          <div>
            <p className="mono" style={sectionLabelStyle}>screenshots</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {restScreenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 2}`}
                  style={{
                    width: '100%',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'block',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {project.updates?.length > 0 && (
          <div>
            <p className="mono" style={sectionLabelStyle}>updates</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[...project.updates]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((u, i) => (
                  <li key={i} className="mono" style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.02em',
                    display: 'flex',
                    gap: '0.8rem',
                  }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{u.date}</span>
                    <span>{u.note}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: '1.5rem',
          paddingTop: '0.4rem',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          marginTop: 'auto',
        }}>
          {relatedDiary.length > 0 && (
            <a
              href={`/diary?tag=${encodeURIComponent(project.slug)}`}
              data-hover
              className="text-link"
            >
              関連 Diary →
            </a>
          )}
          {project.url && project.url !== '#' && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="text-link"
            >
              ↗ OPEN
            </a>
          )}
        </div>
      </GlassPlate>
    </FadeIn>
  )
}

export default function LabPage({ projects, diary }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.location.hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(window.location.hash.slice(1))
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <main style={{
      padding: 'var(--page-pad-top) 2rem var(--page-pad-bottom)',
      minHeight: '100vh',
    }}>
      <div className="lab-grid">
        {projects.map(p => (
          <ProjectPlate key={p.slug} project={p} diary={diary} />
        ))}
      </div>

      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 768px) {
          .lab-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </main>
  )
}
