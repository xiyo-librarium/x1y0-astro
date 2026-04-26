import { useState } from 'react'
import FadeIn from './FadeIn'
import GlassPlate from './GlassPlate'
import SectionKicker from './SectionKicker'
import { statusStyle } from '../lib/projectStatus'

function ProjectItem({ project }) {
  const [hovered, setHovered] = useState(false)
  const st = statusStyle[project.status]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.2rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'padding-left 0.2s ease',
        paddingLeft: hovered ? '0.5rem' : '0',
      }}
    >
      <a
        href={`/lab#${project.slug}`}
        data-hover
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.3rem',
        }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: hovered ? 'var(--mocha)' : 'var(--text-primary)',
            transition: 'color 0.2s ease',
            letterSpacing: '-0.01em',
          }}>
            {project.title}
          </h3>
          <span className="mono" style={{
            fontSize: '0.45rem',
            padding: '0.12rem 0.35rem',
            border: `1px solid ${st.color}`,
            borderRadius: '2px',
            color: st.color,
            letterSpacing: '0.1em',
            opacity: 0.9,
            flexShrink: 0,
            marginLeft: '0.8rem',
          }}>
            {st.label}
          </span>
        </div>

        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '0.5rem',
        }}>
          {project.desc}
        </p>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          {project.tags.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </a>

      {project.url && project.url !== '#' && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '0.4rem',
        }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="text-link"
          >
            ↗ OPEN
          </a>
        </div>
      )}
    </div>
  )
}

export default function SectionLab({ projects }) {
  return (
    <section
      id="lab"
      style={{
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <FadeIn>
        <GlassPlate className="plate-width" style={{
          padding: 'clamp(2rem, 5vw, 3rem)',
        }}>
          <SectionKicker href="/lab">02 / lab</SectionKicker>

          <div>
            {projects.map(p => (
              <ProjectItem key={p.slug} project={p} />
            ))}
          </div>
        </GlassPlate>
      </FadeIn>
    </section>
  )
}
