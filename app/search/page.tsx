import type {Metadata} from 'next'
import Link from 'next/link'
import {client, urlFor} from '@/lib/sanity'
import HeaderActions from '../HeaderActions'
import MobileBottomNav from '../MobileBottomNav'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search CelebSpike stories.',
  robots: {
    index: false,
    follow: true,
  },
}

type Post = {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt?: string
  metaDescription?: string
  mainImage?: {
    asset?: {
      _ref: string
    }
    alt?: string
  }
  categories?: string[]
}

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

function formatDate(date?: string) {
  if (!date) return ''

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams
  const query = params.q?.trim() || ''

  let posts: Post[] = []

  if (query) {
    posts = await client.fetch(
      `
      *[
        _type == "post" &&
        defined(slug.current) &&
        (
          title match $search ||
          metaDescription match $search ||
          count(
            categories[]->[
              title match $search
            ]
          ) > 0
        )
      ] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        metaDescription,
        mainImage,
        "categories": categories[]->title
      }
      `,
      {
        search: `*${query}*`,
      }
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-28 text-white lg:pb-0">

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-black/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[88px]">

          <Link href="/" className="flex items-center">
            <img
              src="/celebspike-logo.png"
              alt="Celebspike"
              className="h-auto w-[185px] sm:w-[220px] lg:w-[245px]"
            />
          </Link>

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

      {/* SEARCH TITLE */}
      <section className="border-b border-white/[0.06] bg-[#080808]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            CelebSpike Search
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Search Stories
          </h1>

          {query ? (
            <p className="mt-4 text-sm text-zinc-500 sm:text-base">
              Results for{' '}
              <span className="font-bold text-white">
                &quot;{query}&quot;
              </span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 sm:text-base">
              Use the search icon to find stories.
            </p>
          )}

        </div>

      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">

        {query && (
          <div className="mb-7 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <span className="h-8 w-1.5 rounded-full bg-red-500" />

              <h2 className="text-xl font-black sm:text-2xl">
                Search Results
              </h2>

            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-zinc-500">
              {posts.length}{' '}
              {posts.length === 1 ? 'Story' : 'Stories'}
            </span>

          </div>
        )}

        {!query ? (

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0b0b0b] px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-7 w-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

            </div>

            <h2 className="mt-5 text-xl font-black">
              Search CelebSpike
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Search for celebrity news, entertainment stories and trending
              updates.
            </p>

          </div>

        ) : posts.length === 0 ? (

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0b0b0b] px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-7 w-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

            </div>

            <h2 className="mt-5 text-xl font-black">
              No stories found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              We couldn&apos;t find any stories matching &quot;{query}&quot;.
              Try another search.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (

              <article
                key={post._id}
                className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0b0b0b] transition hover:-translate-y-1 hover:border-red-500/30"
              >

                <Link href={`/blog/${post.slug.current}`}>

                  {/* IMAGE */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">

                    {post.mainImage?.asset ? (

                      <img
                        src={
                          urlFor(post.mainImage)
                            .width(900)
                            .height(560)
                            .url()
                        }
                        alt={
                          post.mainImage.alt ||
                          post.title
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-950 to-black text-xs font-black tracking-[0.2em] text-zinc-600">
                        CELEBSPIKE
                      </div>

                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {post.categories?.[0] && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[9px] font-black uppercase text-white">
                        {post.categories[0]}
                      </span>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h2 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-red-400">
                      {post.title}
                    </h2>

                    {post.metaDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {post.metaDescription}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">

                      <span className="text-[11px] text-zinc-600">
                        {formatDate(post.publishedAt)}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                        Read

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>

                      </span>

                    </div>

                  </div>

                </Link>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* DESKTOP FOOTER */}
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
            © {new Date().getFullYear()} Celebspike. All rights reserved.
          </p>

        </div>

      </footer>

      <MobileBottomNav />

    </main>
  )
}