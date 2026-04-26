import { useState, useEffect } from 'react'

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const enter = () => setVisible(true)
    const leave = () => setVisible(false)

    const checkHover = (e) => {
      const target = e.target
      const isLink = target.closest('a') || target.closest('button') || target.closest('[data-hover]')
      setHovering(!!isLink)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', checkHover)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseenter', enter)
    document.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', checkHover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  if (!visible) return null

  const size = hovering ? 44 : clicking ? 12 : 18

  return (
    <>
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: hovering ? '1px solid var(--mocha)' : '1px solid rgba(209,124,74,0.35)',
        background: hovering ? 'rgba(209,124,74,0.10)' : 'transparent',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease',
        pointerEvents: 'none',
        zIndex: 10000,
      }} />
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: 'var(--mocha)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 10001,
      }} />
      <style>{`
        @media (min-width: 769px) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}
