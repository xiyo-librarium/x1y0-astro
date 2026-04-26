/*
 * 日付ユーティリティ
 * Diary / Lab エントリの日付は 'YYYY.MM.DD' 文字列。
 */

const RECENT_DAYS = 7

export function isRecent(dateStr: string | undefined | null, days = RECENT_DAYS): boolean {
  if (!dateStr) return false
  const parts = dateStr.split('.').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return false
  const [y, m, d] = parts
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return false
  const diffMs = Date.now() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= days
}
