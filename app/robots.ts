import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },

    sitemap: 'https://celebspike.com/sitemap.xml',
    host: 'https://celebspike.com',
  }
}