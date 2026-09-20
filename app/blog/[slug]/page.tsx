import type {Metadata} from 'next'
import Link from 'next/link'
import {client, urlFor} from '@/lib/sanity'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {notFound} from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      seoTitle,
      metaDescription,
      publishedAt,
      body,
      mainImage,
      "author": author->name,
      "categories": categories[]->title
    }`,
    {slug}
  )
}

/* SEO */
export async function generateMetadata(
  {params}: Props
): Promise<Metadata> {
  const {slug} = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.seoTitle || post.title
  const description =
    post.metaDescription || 'Read the latest story on Celebspike.'

  const canonical = `/blog/${slug}`

  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime: post.publishedAt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.mainImage?.alt || post.title,
            },
          ]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset) return null

      return (
        <figure className="my-10">
          <img
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            className="h-auto w-full rounded-2xl"
          />

          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-zinc-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },

  block: {
    h2: ({children}) => (
      <h2 className="mb-5 mt-12 text-3xl font-black text-white">
        {children}
      </h2>
    ),

    h3: ({children}) => (
      <h3 className="mb-4 mt-10 text-2xl font-bold text-white">
        {children}
      </h3>
    ),

    normal: ({children}) => (
      <p className="mb-6 text-lg leading-8 text-zinc-300">
        {children}
      </p>
    ),

    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-red-500 bg-zinc-900 p-6 text-lg italic text-zinc-300">
        {children}
      </blockquote>
    ),
  },
}

export default async function BlogPost({params}: Props) {
  const {slug} = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <Link href="/" className="text-2xl font-black tracking-tight">
            CELEB<span className="text-red-500">SPIKE</span>
          </Link>

          <nav className="hidden gap-7 text-sm font-semibold md:flex">
            <Link href="/">Home</Link>
            <Link href="/category/celebrity">Celebrity</Link>
            <Link href="/category/news">News</Link>
            <Link href="/category/trending">Trending</Link>
          </nav>

        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-10 md:py-16">

        <Link
          href="/"
          className="mb-8 inline-block text-sm font-bold text-red-500"
        >
          ← BACK TO HOME
        </Link>

        {post.categories?.[0] && (
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            {post.categories[0]}
          </p>
        )}

        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">

          {post.author && (
            <span>
              By <strong className="text-zinc-300">{post.author}</strong>
            </span>
          )}

          {post.publishedAt && (
            <>
              <span>•</span>
              <time>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </>
          )}

        </div>

        {post.mainImage?.asset && (
          <img
            src={urlFor(post.mainImage).width(1400).url()}
            alt={post.mainImage.alt || post.title}
            className="mt-10 h-auto w-full rounded-3xl"
          />
        )}

        {post.metaDescription && (
          <p className="mt-10 border-l-4 border-red-500 pl-6 text-xl leading-8 text-zinc-400">
            {post.metaDescription}
          </p>
        )}

        <div className="mt-12">
          {post.body && (
            <PortableText
              value={post.body}
              components={components}
            />
          )}
        </div>

      </article>

      <footer className="mt-10 border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="text-xl font-black">
            CELEB<span className="text-red-500">SPIKE</span>
          </div>

          <p className="mt-3 text-sm text-zinc-500">
            Celebrity news, stories and trending updates.
          </p>

          <p className="mt-8 text-xs text-zinc-600">
            © {new Date().getFullYear()} Celebspike. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  )
}