import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const entries = (await getCollection('diary')).sort((a, b) =>
    b.data.date.localeCompare(a.data.date)
  )

  return rss({
    title: 'x1y0.net — Diary',
    description: 'xiyo の日記',
    site: context.site ?? 'https://x1y0.net',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.body?.slice(0, 200) ?? '',
      pubDate: new Date(entry.data.date.replaceAll('.', '-')),
      link: `/diary?open=${encodeURIComponent(entry.data.date)}`,
      categories: entry.data.tags ?? [],
    })),
    customData: '<language>ja</language>',
  })
}
