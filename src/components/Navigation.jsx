import { useState, useEffect } from 'react'

const navItems = [
  { id: 'info', label: 'Info', index: '01' },
  { id: 'lab', label: 'Lab', index: '02' },
  { id: 'diary', label: 'Diary', index: '03' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('info')
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  )
  const isHome = pathname === '/'

  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    document.addEventListener('astro:after-swap', update)
    return () => document.removeEventListener('astro:after-swap', update)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      if (!isHome) return
      const sections = navItems.map(n => document.getElementById(n.id))
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= 150) {
          setActive(navItems[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const handleNavClick = (e, id) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    // 非ホームでは <a href="/#id"> のデフォルト動作で遷移
  }

  return (
    <>
      <nav className={`top-nav ${isHome ? 'top-nav-home' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.8rem 2rem' : '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: scrolled ? 'rgba(22,18,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(164,119,100,0.08)' : '1px solid transparent',
      }}>
        <div className="nav-back-slot">
          {!isHome && (
            <a
              href="/"
              data-hover
              className="mono"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.4rem 0',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--mocha)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              ← Back
            </a>
          )}
        </div>

        <div className="nav-items" style={{
          display: isHome ? 'flex' : 'none',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              data-hover
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'lowercase',
                textDecoration: 'none',
                color: active === item.id ? 'var(--mocha)' : 'var(--text-secondary)',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{item.index}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          /* スマホ: ホームではバー全部隠す（戻る先がない）。
             Lab/Diary 等の非ホームでは Back だけ出したいのでバーは残す。
             nav-items 自体は inline style で isHome=false の時 display:none。 */
          .top-nav.top-nav-home { display: none !important; }
        }
      `}</style>
    </>
  )
}
