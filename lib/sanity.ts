import {createClient} from 'next-sanity'
import {createImageUrlBuilder} from '@sanity/image-url'

export const client = createClient({
  projectId: '8d2fu1m6',
  dataset: 'production',
  apiVersion: '2026-09-20',
  useCdn: true,
})

const builder = createImageUrlBuilder({
  projectId: '8d2fu1m6',
  dataset: 'production',
})

export function urlFor(source: any) {
  return builder.image(source)
}