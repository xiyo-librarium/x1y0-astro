import { marked } from 'marked'

// 単一改行も <br> として保持し、本文の自然な改行リズムを維持する
marked.setOptions({
  breaks: true,
  gfm: true,
})

// 外部 URL のリンクは自動的に target="_blank" + rel
marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens)
      const isExternal = /^https?:\/\//i.test(href)
      const titleAttr = title ? ` title="${title}"` : ''
      const targetAttr = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : ''
      return `<a href="${href}"${titleAttr}${targetAttr}>${text}</a>`
    },
  },
})

export function renderMarkdown(source: string | undefined | null): string {
  if (!source) return ''
  return marked.parse(source.trim()) as string
}
