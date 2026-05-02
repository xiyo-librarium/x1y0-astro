import { useState } from 'react'
import FadeIn from './FadeIn'
import GlassPlate from './GlassPlate'
import { isRecent } from '../lib/dates'

function RecentItem({ item, onClick }) {
  const [hovered, setHovered] = useState(false)
  const fresh = isRecent(item.date)
  return (
    <button
      data-hover
      className="recent-item"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        background: 'none',
        border: 'none',
        padding: '0.5rem 0',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div className="recent-item-label" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        minWidth: 0,
        flex: 1,
        transform: hovered ? 'translateX(0.5rem)' : 'translateX(0)',
        transition: 'transform 0.2s ease',
      }}>
        <span className="mono" style={{
          fontSize: '0.5rem',
          color: 'var(--mocha)',
          letterSpacing: '0.06em',
          flexShrink: 0,
          textTransform: 'uppercase',
          opacity: 0.9,
          width: '3rem',
        }}>
          {item.section}
        </span>
        <span className="recent-item-title" style={{
          fontSize: '0.8rem',
          color: hovered ? 'var(--mocha)' : 'var(--text-primary)',
          transition: 'color 0.2s ease',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          flex: 1,
        }}>
          {item.label}
        </span>
      </div>
      <span className="recent-item-meta" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexShrink: 0,
      }}>
        {fresh && <span className="new-badge">new</span>}
        <span className="mono" style={{
          fontSize: '0.55rem',
          color: 'var(--text-muted)',
        }}>
          {item.date}
        </span>
      </span>
    </button>
  )
}

function SocialIcon({ icon, size = 16 }) {
  if (icon === 'x') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return null
}

export default function SectionTop({ profile, recentUpdates }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="info"
      className="section-top"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--page-pad-top) 1.5rem 3rem',
      }}
    >
      <FadeIn delay={0.2}>
        <GlassPlate className="plate-width" style={{
          padding: 'clamp(2rem, 5vw, 3rem)',
        }}>
          <p className="mono" style={{
            color: 'var(--mocha)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            marginBottom: '1.5rem',
          }}>
            01 / info
          </p>

          <div className="profile-grid">
            <div>
              <p className="mono" style={{
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                marginBottom: '0.8rem',
              }}>
                profile
              </p>
              <h3 className="mono" style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '0.6rem',
              }}>
                {profile.name}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '1rem',
                whiteSpace: 'pre-line',
              }}>
                {profile.bio}
              </p>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {profile.links.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hover
                    aria-label={link.label}
                    title={link.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '999px',
                      color: 'var(--text-muted)',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--mocha)'
                      e.currentTarget.style.background = 'rgba(164,119,100,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <SocialIcon icon={link.icon} size={32} />
                  </a>
                ))}
              </div>
            </div>

            <div className="profile-divider" />

            <div>
              <p className="mono" style={{
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                marginBottom: '0.8rem',
              }}>
                recent
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {recentUpdates.map((item, i) => (
                  <RecentItem key={i} item={item} onClick={() => scrollTo(item.section)} />
                ))}
              </div>
            </div>
          </div>
        </GlassPlate>
      </FadeIn>

      <style>{`
        .profile-grid {
          display: grid;
          grid-template-columns: 2fr auto 3fr;
          gap: 2rem;
          align-items: start;
        }
        .profile-divider {
          width: 1px;
          background: rgba(255,255,255,0.04);
          align-self: stretch;
        }
        @media (max-width: 768px) {
          .section-top {
            padding-bottom: 3rem !important;
          }
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .profile-divider {
            width: 100%;
            height: 1px;
            margin: 1.5rem 0;
          }
        }
        @media (max-width: 480px) {
          .recent-item {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.25rem !important;
          }
          .recent-item .recent-item-title {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            line-height: 1.45;
          }
          .recent-item .recent-item-meta {
            justify-content: flex-end;
          }
        }
      `}</style>
    </section>
  )
}
