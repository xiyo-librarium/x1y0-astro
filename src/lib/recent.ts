import { getCollection } from 'astro:content'

export type RecentItem = {
  section: 'lab' | 'diary'
  label: string
  date: string
}

const MAX_ITEMS = 5

export async function getRecentUpdates(): Promise<RecentItem[]> {
  const [labs, diaries] = await Promise.all([
    getCollection('lab'),
    getCollection('diary'),
  ])

  const labItems: RecentItem[] = labs.map(p => ({
    section: 'lab',
    label: `${p.data.title} を公開`,
    date: p.data.date,
  }))

  const diaryItems: RecentItem[] = diaries.map(d => ({
    section: 'diary',
    label: d.data.title,
    date: d.data.date,
  }))

  return [...labItems, ...diaryItems]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ITEMS)
}
