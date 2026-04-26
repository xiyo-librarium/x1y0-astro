import { useState } from 'react'

/*
 * 濃いめの半透明ガラスプレート。
 * 裏が若干透ける。マウスオンでふわっと発光。
 */
export default function GlassPlate({ children, className = '', style = {}, ...props }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(20, 16, 14, var(--plate-bg-alpha, 0.55))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(245, 238, 229, 0.15)' : 'rgba(255, 255, 255, 0.04)'}`,
        borderRadius: '14px',
        boxShadow: hovered
          ? `0 0 24px rgba(245, 238, 229, 0.13),
             0 0 60px rgba(245, 238, 229, 0.08),
             0 0 120px rgba(245, 238, 229, 0.05),
             0 8px 40px rgba(0,0,0,0.3),
             0 1px 0 rgba(255,255,255,0.05) inset`
          : `0 0 24px rgba(245, 238, 229, 0),
             0 0 60px rgba(245, 238, 229, 0),
             0 0 120px rgba(245, 238, 229, 0),
             0 8px 40px rgba(0,0,0,0.35),
             0 1px 0 rgba(255,255,255,0.03) inset`,
        transition: 'box-shadow 1s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 1s cubic-bezier(0.165, 0.84, 0.44, 1)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
