/*
 * トップページのセクション見出し
 * 「02 / lab」みたいな mono スモールキャップ + hover で → が出る
 */
export default function SectionKicker({ href, children }) {
  return (
    <a href={href} data-hover className="section-kicker">
      {children}
      <span className="arrow">→</span>
    </a>
  )
}
