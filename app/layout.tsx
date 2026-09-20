import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://celebspike.com'),

  title: {
    default: 'Celebspike | Celebrity News & Trending Stories',
    template: '%s | Celebspike',
  },

  description:
    'Celebspike brings you the latest celebrity news, entertainment stories and trending updates.',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: 'website',
    siteName: 'Celebspike',
    title: 'Celebspike | Celebrity News & Trending Stories',
    description:
      'Latest celebrity news, entertainment stories and trending updates.',
    url: 'https://celebspike.com',
  },

  twitter: {
    card: 'summary_large_image',
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