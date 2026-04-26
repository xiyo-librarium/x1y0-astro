import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['live', 'beta', 'coming']),
    url: z.string().url(),
    date: z.string(),
    screenshots: z.array(z.string()).optional().default([]),
    updates: z
      .array(z.object({ date: z.string(), note: z.string() }))
      .optional()
      .default([]),
  }),
})

const diary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/diary' }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = { lab, diary }
