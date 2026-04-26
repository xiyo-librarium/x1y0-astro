import { useMemo } from 'react'

/*
 * "x1y0" を丸みピクセルフォント風に定義（小文字）
 * 画像のフォントに合わせたラウンド・ドットマトリクス風
 * 各文字は 5列 × 7行、1=塗り / 0=透明
 */
const glyphs = {
  x: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [1,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  y: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,1,1,1,0],
  ],
  '0': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  l: [
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
  ],
  a: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
  ],
  b: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  d: [
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
  ],
  i: [
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  r: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,0,1,1,0],
    [1,1,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
}

const WORD = ['x', '1', 'y', '0']
const GAP = 1

export default function PixelLogo({ size = 3, color = '#f1ebe0' }) {
  const grid = useMemo(() => {
    const rows = 7
    const allCols = []
    WORD.forEach((char, ci) => {
      const glyph = glyphs[char]
      for (let r = 0; r < rows; r++) {
        if (!allCols[r]) allCols[r] = []
        if (ci > 0) {
          for (let g = 0; g < GAP; g++) allCols[r].push(0)
        }
        glyph[r].forEach(px => allCols[r].push(px))
      }
    })
    return allCols
  }, [])

  const totalCols = grid[0]?.length || 0
  const totalRows = grid.length

  return (
    <div
      data-hover
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${totalCols}, ${size}px)`,
        gridTemplateRows: `repeat(${totalRows}, ${size}px)`,
        gap: `${size * 0.25}px`,
      }}
      aria-label="x1y0"
      role="img"
    >
      {grid.flatMap((row, ri) =>
        row.map((cell, ci) => (
          <div
            key={`${ri}-${ci}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: cell ? color : 'transparent',
              opacity: cell ? 0.9 : 0,
            }}
          />
        ))
      )}
    </div>
  )
}

// Export glyphs for use in background component
export { glyphs, WORD, GAP }
