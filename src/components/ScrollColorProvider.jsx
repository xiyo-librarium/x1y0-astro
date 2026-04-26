import { useEffect } from 'react'

/*
 * 背景の点灯率（--lit-ratio, 0→1）に応じて
 * GlassPlate の背景アルファを濃くしていく。
 *
 * 上部（dark bg）: ガラスっぽい半透明
 * 下部（ivory bg）: ほぼ不透明な濃いカード
 *  → クリーム系テキストが常に読める
 */
export default function ScrollColorProvider() {
  useEffect(() => {
    const root = document.documentElement

    let lastA = -1

    const update = () => {
      const t = parseFloat(root.style.getPropertyValue('--lit-ratio')) || 0
      // 0.55 → 0.94 にリマップ
      const alpha = (0.55 + (0.94 - 0.55) * t).toFixed(3)
      if (alpha !== lastA) {
        root.style.setProperty('--plate-bg-alpha', alpha)
        lastA = alpha
      }
    }

    let frame
    const tick = () => {
      update()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [])

  return null
}
