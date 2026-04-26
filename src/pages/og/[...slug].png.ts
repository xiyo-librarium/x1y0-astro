import type { APIRoute, GetStaticPaths } from 'astro'
import { generateOpenGraphImage } from 'astro-og-canvas'
import { getCollection } from 'astro:content'

type OgPage = {
  title: string
  description?: string
}

async function buildPages(): Promise<Map<string, OgPage>> {
  const map = new Map<string, OgPage>()
  map.set('home', {
    title: 'x1y0.net',
    description: 'まだ形になっていないアイデアを、プロダクトとして世に送り出す。',
  })
  map.set('lab', {
    title: 'Lab — x1y0.net',
    description: '個人的に作っているもの。',
  })
  map.set('diary', {
    title: 'Diary — x1y0.net',
    description: '日々考えたこと・作ったもの・メモ。',
  })

  const diary = await getCollection('diary')
  for (const entry of diary) {
    map.set(`diary/${entry.id}`, {
      title: entry.data.title,
      description: `Diary · ${entry.data.date}`,
    })
  }

  const lab = await getCollection('lab')
  for (const project of lab) {
    map.set(`lab/${project.id}`, {
      title: project.data.title,
      description: project.data.desc,
    })
  }

  return map
}

export const getStaticPaths: GetStaticPaths = async () => {
  const map = await buildPages()
  return [...map.entries()].map(([slug, data]) => ({
    params: { slug },
    props: data,
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOpenGraphImage({
    title: (props as OgPage).title,
    description: (props as OgPage).description,
    bgGradient: [
      [38, 30, 24],
      [22, 18, 16],
    ],
    border: { color: [209, 124, 74], width: 4 },
    padding: 80,
    font: {
      title: {
        size: 64,
        families: ['Space Grotesk'],
        weight: 'Bold',
        color: [237, 230, 223],
        lineHeight: 1.2,
      },
      description: {
        size: 28,
        families: ['Space Grotesk'],
        color: [160, 148, 134],
        lineHeight: 1.4,
      },
    },
  })

  return new Response(png as unknown as BodyInit, {
    headers: { 'Content-Type': 'image/png' },
  })
}
