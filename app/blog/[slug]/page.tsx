import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {client, urlFor} from '@/lib/sanity'
import HeaderActions from '../../HeaderActions'
import MobileBottomNav from '../../MobileBottomNav'
import SaveButton from '../../SaveButton'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

type Post = {
  title: string
  seoTitle?: string
  metaDescription?: string
  publishedAt?: string

  author?: {
    name?: string
  }

  mainImage?: {
    asset?: {
      _ref: string
    }
    alt?: string
  }

  categories?: string[]

  body?: any[]
}

const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    title,
    seoTitle,
    metaDescription,
    publishedAt,
    body,

    mainImage {
      asset,
      alt
    },

    "author": author->{
      name
    },

    "categories": categories[]->title
  }
`

async function getPost(
  slug: string
): Promise<Post | null> {
  return client.fetch(postQuery, {slug})
}

function formatDate(date?: string) {
  if (!date) return ''

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

/* =========================
   SEO METADATA
========================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {slug} = await params

  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Story Not Found',
    }
  }

  const description =
    post.metaDescription ||
    'Read the latest celebrity news and trending stories on CelebSpike.'

  const image = post.mainImage?.asset
    ? urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .url()
    : undefined

  return {
    title: post.seoTitle || post.title,

    description,

    alternates: {
      canonical: `/blog/${slug}`,
    },

    openGraph: {
      type: 'article',

      title:
        post.seoTitle ||
        post.title,

      description,

      url: `/blog/${slug}`,

      publishedTime:
        post.publishedAt,

      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,

              alt:
                post.mainImage?.alt ||
                post.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',

      title:
        post.seoTitle ||
        post.title,

      description,

      images: image
        ? [image]
        : undefined,
    },
  }
}

/* =========================
   PORTABLE TEXT
========================= */

const portableTextComponents = {
  types: {
    image: ({
      value,
    }: {
      value: any
    }) => {
      if (!value?.asset) {
        return null
      }

      return (
        <figure className="my-9">

          <img
            src={
              urlFor(value)
                .width(1200)
                .url()
            }
            alt={value.alt || ''}
            className="h-auto w-full rounded-[22px] border border-white/[0.08]"
          />

          {value.caption && (
            <figcaption className="mt-3 text-center text-xs leading-5 text-zinc-600">
              {value.caption}
            </figcaption>
          )}

        </figure>
      )
    },
  },

  block: {
    normal: ({
      children,
    }: any) => (
      <p className="mb-6 text-[16px] leading-8 text-zinc-300 sm:text-[17px]">
        {children}
      </p>
    ),

    h2: ({
      children,
    }: any) => (
      <h2 className="mb-4 mt-10 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    ),

    h3: ({
      children,
    }: any) => (
      <h3 className="mb-3 mt-8 text-xl font-black text-white sm:text-2xl">
        {children}
      </h3>
    ),

    blockquote: ({
      children,
    }: any) => (
      <blockquote className="my-8 border-l-4 border-red-500 bg-red-950/10 px-5 py-4 text-lg italic leading-8 text-zinc-300">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({
      children,
    }: any) => (
      <ul className="mb-6 ml-5 list-disc space-y-2 text-zinc-300">
        {children}
      </ul>
    ),

    number: ({
      children,
    }: any) => (
      <ol className="mb-6 ml-5 list-decimal space-y-2 text-zinc-300">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({
      children,
    }: any) => (
      <li className="pl-1 leading-7">
        {children}
      </li>
    ),

    number: ({
      children,
    }: any) => (
      <li className="pl-1 leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({
      children,
    }: any) => (
      <strong className="font-black text-white">
        {children}
      </strong>
    ),

    em: ({
      children,
    }: any) => (
      <em className="italic">
        {children}
      </em>
    ),
  },
}

/* =========================
   ARTICLE PAGE
========================= */

export default async function BlogPost({
  params,
}: PageProps) {
  const {slug} = await params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  /* =========================
     REMOVE FIRST BODY IMAGE
     WHEN FEATURED IMAGE EXISTS
  ========================= */

  let firstBodyImageSkipped = false

  const filteredBody =
    post.body?.filter((block) => {
      if (
        post.mainImage?.asset &&
        !firstBodyImageSkipped &&
        block?._type === 'image' &&
        block?.asset
      ) {
        firstBodyImageSkipped = true
        return false
      }

      return true
    }) || []

  /* =========================
     IMAGE URLS
  ========================= */

  const saveImage =
    post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(900)
          .height(560)
          .url()
      : undefined

  const structuredImage =
    post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .url()
      : undefined

  const articleUrl =
    `https://celebspike.com/blog/${slug}`

  /* =========================
     ARTICLE JSON-LD
  ========================= */

  const jsonLd = {
    '@context':
      'https://schema.org',

    '@type':
      'NewsArticle',

    headline:
      post.title,

    description:
      post.metaDescription ||
      post.title,

    url:
      articleUrl,

    mainEntityOfPage: {
      '@type':
        'WebPage',

      '@id':
        articleUrl,
    },

    ...(structuredImage
      ? {
          image: [
            structuredImage,
          ],
        }
      : {}),

    ...(post.publishedAt
      ? {
          datePublished:
            post.publishedAt,

          dateModified:
            post.publishedAt,
        }
      : {}),

    author: {
      '@type':
        'Person',

      name:
        post.author?.name ||
        'CelebSpike',
    },

    publisher: {
      '@type':
        'Organization',

      name:
        'CelebSpike',

      url:
        'https://celebspike.com',
    },
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-28 text-white lg:pb-0">

      {/* =========================
          JSON-LD
      ========================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              jsonLd
            ).replace(
              /</g,
              '\\u003c'
            ),
        }}
      />

      {/* =========================
          HEADER
      ========================= */}

      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-black/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[88px]">

          <Link
            href="/"
            className="flex min-w-0 shrink items-center"
          >
            <img
              src="/celebspike-logo.png"
              alt="Celebspike"
              className="h-auto w-[185px] max-w-full sm:w-[220px] lg:w-[245px]"
            />
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 lg:flex">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/#latest"
              className="transition hover:text-white"
            >
              Latest
            </Link>

            <Link
              href="/#categories"
              className="transition hover:text-white"
            >
              Categories
            </Link>

            <Link
              href="/#trending"
              className="transition hover:text-white"
            >
              Trending
            </Link>

          </nav>

          <HeaderActions />

        </div>

      </header>

      {/* =========================
          ARTICLE
      ========================= */}

      <article>

        {/* ARTICLE HEADER */}

        <section className="border-b border-white/[0.06]">

          <div className="mx-auto max-w-4xl px-4 pb-9 pt-9 sm:px-6 sm:pb-12 sm:pt-12">

            {/* CATEGORY */}

            {post.categories?.[0] && (
              <span className="inline-flex rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-red-400">
                {post.categories[0]}
              </span>
            )}

            {/* TITLE */}

            <h1 className="mt-5 text-[36px] font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-[58px]">
              {post.title}
            </h1>

            {/* AUTHOR + DATE */}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 sm:text-sm">

              {post.author?.name && (
                <>
                  <span>
                    By{' '}

                    <strong className="font-bold text-zinc-300">
                      {post.author.name}
                    </strong>
                  </span>

                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                </>
              )}

              {post.publishedAt && (
                <span>
                  {formatDate(
                    post.publishedAt
                  )}
                </span>
              )}

            </div>

            {/* SAVE BUTTON */}

            <div className="mt-6">

              <SaveButton
                slug={slug}
                title={post.title}
                description={
                  post.metaDescription
                }
                publishedAt={
                  post.publishedAt
                }
                image={saveImage}
              />

            </div>

          </div>

        </section>

        {/* =========================
            FEATURED IMAGE
        ========================= */}

        {post.mainImage?.asset && (
          <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10">

            <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0b0b]">

              <img
                src={
                  urlFor(
                    post.mainImage
                  )
                    .width(1600)
                    .height(1000)
                    .url()
                }
                alt={
                  post.mainImage.alt ||
                  post.title
                }
                className="h-auto w-full object-cover"
              />

            </div>

          </section>
        )}

        {/* =========================
            ARTICLE BODY
        ========================= */}

        <section className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">

          {/* DESCRIPTION */}

          {post.metaDescription && (
            <div className="mb-9 rounded-r-2xl border-l-4 border-red-500 bg-red-950/10 px-5 py-4">

              <p className="text-[15px] font-medium leading-7 text-zinc-300 sm:text-base">
                {post.metaDescription}
              </p>

            </div>
          )}

          {/* CONTENT */}

          {filteredBody.length ? (

            <div>

              <PortableText
                value={filteredBody}
                components={
                  portableTextComponents
                }
              />

            </div>

          ) : (

            <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6 text-sm text-zinc-500">
              This story does not have any content yet.
            </div>

          )}

          {/* =========================
              BACK HOME
          ========================= */}

          <div className="mt-12 border-t border-white/[0.08] pt-8">

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-500/40 hover:text-white"
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>

              Back to Home

            </Link>

          </div>

        </section>

      </article>

      {/* =========================
          DESKTOP FOOTER
      ========================= */}

      <footer className="hidden border-t border-white/[0.08] bg-black lg:block">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10">

          <div>

            <img
              src="/celebspike-logo.png"
              alt="Celebspike"
              className="w-[210px]"
            />

            <p className="mt-4 text-xs text-zinc-600">
              Celebrity news, entertainment and trending stories.
            </p>

          </div>

          <p className="text-xs text-zinc-600">
            ©{' '}
            {new Date().getFullYear()}{' '}
            Celebspike. All rights reserved.
          </p>

        </div>

      </footer>

      {/* MOBILE NAV */}

      <MobileBottomNav />

    </main>
  )
}