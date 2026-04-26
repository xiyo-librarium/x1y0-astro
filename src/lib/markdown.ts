import { marked } from 'marked'

// 単一改行も <br> として保持し、本文の自然な改行リズムを維持する
marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdown(source: string | undefined | null): string {
  if (!source) return ''
  return marked.parse(source.trim()) as string
}
