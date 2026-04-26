/*
 * prefers-reduced-motion ヘルパー
 * - 関数版: 副作用がない判定（PixelBackground 等の非 React コンテキスト用）
 * - フック版: state として購読（再レンダ要する React コンポ用）
 */
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(QUERY).matches
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion())
  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduced
}
