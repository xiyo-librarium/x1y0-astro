export type SocialLink = {
  label: string
  url: string
  icon: 'x' | 'instagram'
}

export const profile = {
  name: 'xiyo',
  bio: '会社員。\n趣味でいろいろ作っています。',
  links: [
    { label: 'X / Twitter', url: 'https://x.com/x1y0z1', icon: 'x' },
    { label: 'Instagram', url: 'https://instagram.com/x1y0z1', icon: 'instagram' },
  ] satisfies SocialLink[],
}
