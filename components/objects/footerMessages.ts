import type { IconType } from 'react-icons'
import {
  SiFontawesome,
  SiLucide,
  SiNextdotjs,
  SiShadcnui,
  SiSimpleicons,
  SiTailwindcss,
  SiVercel
} from 'react-icons/si'

export type FooterMessage = {
  text: string
  url: string
  Icon: IconType
}

export const footerMessages: FooterMessage[] = [
  {
    text: 'Built with Next.js',
    url: 'https://nextjs.org',
    Icon: SiNextdotjs
  },
  {
    text: 'Icons by Lucide',
    url: 'https://lucide.dev/',
    Icon: SiLucide
  },
  {
    text: 'Icons by Simple Icons',
    url: 'https://simpleicons.org/',
    Icon: SiSimpleicons
  },
  {
    text: 'Font by Vercel',
    url: 'https://vercel.com/font',
    Icon: SiVercel
  },
  {
    text: 'Icons by Font Awesome',
    url: 'https://fontawesome.com/',
    Icon: SiFontawesome
  },
  {
    text: 'Components by Shadcn',
    url: 'https://ui.shadcn.com/',
    Icon: SiShadcnui
  },
  {
    text: 'Styled with Tailwind',
    url: 'https://tailwindcss.com/',
    Icon: SiTailwindcss
  }
]
