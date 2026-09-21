import {MetadataRoute} from 'next'
import {client} from '@/lib/sanity'

type SitemapPost = {
  slug: {
    current: string
  }
  publishedAt?: string
  _updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.celebspike.com'

  const posts: SitemapPost[] = await client.fetch(`
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      slug,
      publishedAt,
      _updatedAt
    }
  `)

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: post._updatedAt || post.publishedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}