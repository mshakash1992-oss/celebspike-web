import type {MetadataRoute} from 'next'
import {client} from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch(`
    *[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `)

  const postUrls: MetadataRoute.Sitemap = posts.map(
    (post: {slug: string; _updatedAt: string}) => ({
      url: `https://celebspike.com/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  )

  return [
    {
      url: 'https://celebspike.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}