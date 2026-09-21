import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.celebspike.com'),

  title: {
    default: 'Celebspike | Celebrity News & Trending Stories',
    template: '%s | Celebspike',
  },

  description:
    'Celebspike brings you the latest celebrity news, entertainment updates, trending stories and exclusive coverage.',

  alternates: {
    canonical: '/',
  },

  verification: {
    other: {
      'msvalidate.01': '1CB32B6448D7478A96B56C53A036AE53',
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    url: 'https://www.celebspike.com',
    siteName: 'Celebspike',
    title: 'Celebspike | Celebrity News & Trending Stories',
    description:
      'Celebspike brings you the latest celebrity news, entertainment updates, trending stories and exclusive coverage.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Celebspike | Celebrity News & Trending Stories',
    description:
      'Celebspike brings you the latest celebrity news, entertainment updates, trending stories and exclusive coverage.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}