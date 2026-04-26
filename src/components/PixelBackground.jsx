import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { glyphs, GAP } from './PixelLogo'
import { prefersReducedMotion } from '../lib/motion'

/*
 * 画面全体に方眼グリッド（スクエア）を固定配置。
 * グリッド線は見せず、セルのみ描画。
 *
 * route 切替時は、旧 word の状態と新 word の状態が異なるセルだけ
 * ガチャガチャと点滅し、各セルがランダムな settle 時刻に達したら
 * 新しい状態に固定される。約 0.7 秒で全セルが落ち着く。
 *
 * Astro 版: react-router-dom の useLocation の代わりに
 * window.location.pathname を購読 + astro:after-swap で更新。
 */

const TRANSITION_MS = 700

function deriveWord(pathname) {
  if (pathname.startsWith('/lab')) return ['l', 'a', 'b']
  if (pathname.startsWith('/diary')) return ['d', 'i', 'a', 'r', 'y']
  return ['x', '1', 'y', '0']
}

export default function PixelBackground() {
  const canvasRef = useRef(null)
  const stateRef = useRef({ scroll: 0, docHeight: 3000 })
  const gridRef = useRef(null)
  const previousGridRef = useRef(null)
  const animRef = useRef(null)
  const transitionRef = useRef({ active: false, startTime: 0 })

  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  )

  // Astro の view-transitions navigation 対応
  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    document.addEventListener('astro:after-swap', update)
    return () => document.removeEventListener('astro:after-swap', update)
  }, [])

  const word = useMemo(() => deriveWord(pathname), [pathname])

  const buildTextGrid = useCallback(() => {
    const rows = 7
    const allRows = []
    word.forEach((char, ci) => {
      const glyph = glyphs[char]
      if (!glyph) return
      for (let r = 0; r < rows; r++) {
        if (!allRows[r]) allRows[r] = []
        if (ci > 0) {
          for (let g = 0; g < GAP; g++) allRows[r].push(0)
        }
        glyph[r].forEach(px => allRows[r].push(px))
      }
    })
    return allRows
  }, [word])

  const initGrid = useCallback((canvas) => {
    const w = canvas.width
    const h = canvas.height
    const dpr = window.devicePixelRatio || 1
    const textGrid = buildTextGrid()
    const textCols = textGrid[0].length
    const textRows = textGrid.length

    const cellSize = Math.round(Math.min(w, h) * 0.012)
    const step = cellSize

    const cols = Math.ceil(w / step)
    const rows = Math.ceil(h / step)

    const screenW = w / dpr
    const targetTextH_css = screenW < 500 ? screenW * 0.10 : screenW * 0.045
    const targetTextHpx = targetTextH_css * dpr
    const textCellScale = Math.max(1, Math.round(targetTextHpx / (textRows * step)))

    const marginCol = Math.round(2 * dpr)
    const marginRow = Math.round(3.5 * dpr)

    const topTextSet = new Set()
    for (let tr = 0; tr < textRows; tr++) {
      for (let tc = 0; tc < textCols; tc++) {
        if (!textGrid[tr][tc]) continue
        for (let dr = 0; dr < textCellScale; dr++) {
          for (let dc = 0; dc < textCellScale; dc++) {
            const gr = marginRow + tr * textCellScale + dr
            const gc = marginCol + tc * textCellScale + dc
            if (gr < rows && gc < cols) {
              topTextSet.add(gr * cols + gc)
            }
          }
        }
      }
    }

    const textBlockH = textRows * textCellScale
    const bottomMarginRow = rows - marginRow - textBlockH
    const bottomTextSet = new Set()
    for (let tr = 0; tr < textRows; tr++) {
      for (let tc = 0; tc < textCols; tc++) {
        if (!textGrid[tr][tc]) continue
        for (let dr = 0; dr < textCellScale; dr++) {
          for (let dc = 0; dc < textCellScale; dc++) {
            const gr = bottomMarginRow + tr * textCellScale + dr
            const gc = marginCol + tc * textCellScale + dc
            if (gr >= 0 && gr < rows && gc < cols) {
              bottomTextSet.add(gr * cols + gc)
            }
          }
        }
      }
    }

    const cells = new Array(rows * cols)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        const isTopText = topTextSet.has(idx)
        const isBottomText = bottomTextSet.has(idx)
        cells[idx] = {
          x: c * step,
          y: r * step,
          isTopText,
          isBottomText,
          threshold: isTopText ? -1 : Math.random() * 0.98 + 0.01,
          hasDiff: false,
          settleTime: 0,
        }
      }
    }

    const prev = previousGridRef.current
    if (prev && prev.cells.length === cells.length) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        const oldCell = prev.cells[i]
        if (oldCell.isTopText !== cell.isTopText) {
          cell.hasDiff = true
          cell.settleTime = 0.05 + Math.random() * 0.85
        }
      }
    }

    return { cells, cellSize, totalCells: rows * cols }
  }, [buildTextGrid])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gridRef.current = initGrid(canvas)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      stateRef.current.scroll = window.scrollY
      stateRef.current.docHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      )
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const BG = '#161210'
    const CELL_COLOR = '#d9cfc2'

    const sigmoid = (x, sigma = 0.12) => {
      const k = 1 / sigma
      return 1 / (1 + Math.exp(-k * (x - 0.5)))
    }
    const s0 = sigmoid(0)
    const s1 = sigmoid(1)
    const easeNormal = (x) => (sigmoid(x) - s0) / (s1 - s0)

    const draw = () => {
      const grid = gridRef.current
      if (!grid) {
        animRef.current = requestAnimationFrame(draw)
        return
      }

      const { scroll, docHeight } = stateRef.current
      const tLinear = Math.min(scroll / docHeight, 1)
      const t = tLinear <= 0 ? 0 : tLinear >= 1 ? 1 : easeNormal(tLinear)
      const tRounded = Math.round(t * 1000) / 1000
      document.documentElement.style.setProperty('--lit-ratio', tRounded)

      const transition = transitionRef.current
      let scrambling = false
      let tt = 0
      if (transition.active) {
        const elapsed = performance.now() - transition.startTime
        tt = elapsed / TRANSITION_MS
        if (tt >= 1) {
          transition.active = false
        } else {
          scrambling = true
        }
      }

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = CELL_COLOR
      const { cells, cellSize } = grid

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]

        let isTop = cell.isTopText
        let isBottom = cell.isBottomText

        if (scrambling && cell.hasDiff && tt < cell.settleTime) {
          isTop = Math.random() < 0.5
          isBottom = false
        }

        if (isBottom) continue
        if (isTop || t >= cell.threshold) {
          ctx.fillRect(cell.x, cell.y, cellSize, cellSize)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      previousGridRef.current = gridRef.current
      transitionRef.current = {
        active: !prefersReducedMotion(),
        startTime: performance.now(),
      }
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [initGrid])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        pointerEvents: 'none',
      }}
    />
  )
}
