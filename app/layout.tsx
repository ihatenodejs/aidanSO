import { Metadata, Viewport } from 'next'
import './globals.css'
import { GeistSans } from 'geist/font/sans'
import AnimatedTitle from '../components/objects/AnimatedTitle'
import { LayoutClient, MobileMenuProvider } from '../components/layout'
import { Footer } from '../components/navigation'
import { footerMessages } from '../components/objects/footerMessages'

export const dynamic = 'force-dynamic'

const getFooterMessageIndex = (): number | undefined => {
  const totalMessages = footerMessages.length

  if (!totalMessages) {
    return undefined
  }

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const buffer = new Uint32Array(1)
    crypto.getRandomValues(buffer)
    return buffer[0] % totalMessages
  }

  return Math.floor(Math.random() * totalMessages)
}

export const metadata: Metadata = {
  title: 'aidan.so',
  description: 'The Internet home of Aidan. Come on in!',
  authors: [{ name: 'aidan.so' }],
  robots: 'index, follow',
  metadataBase: new URL('https://aidan.so'),
  openGraph: {
    type: 'website',
    url: 'https://aidan.so',
    title: 'aidan.so',
    description: 'The Internet home of Aidan. Come on in!',
    siteName: 'aidan.so',
    images: [
      {
        url: 'https://aidan.so/android-icon-192x192.png',
        width: 192,
        height: 192
      }
    ]
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' }
    ]
  },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const footerMessageIndex = getFooterMessageIndex()

  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${GeistSans.className} flex min-h-screen flex-col bg-gray-900 text-gray-100`}
      >
        <MobileMenuProvider>
          <AnimatedTitle />
          <LayoutClient>{children}</LayoutClient>
          <Footer footerMessageIndex={footerMessageIndex} />
        </MobileMenuProvider>
      </body>
    </html>
  )
}
