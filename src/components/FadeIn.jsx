import { useRef, useEffect, useState } from 'react'
import { useReducedMotion } from '../lib/motion'

export default function FadeIn({ children, delay = 0, direction = 'up', style = {}, ...props }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [reduced])

  const transforms = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(40px)',
    right: 'translateX(-40px)',
    none: 'none',
  }

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: 'inherit',
        opacity: visible ? 1 : 0,
        transform: visible || reduced ? 'none' : transforms[direction],
        transition: reduced
          ? 'none'
          : `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
