import Link from 'next/link'
import {client, urlFor} from '@/lib/sanity'
import HeaderActions from './HeaderActions'
import MobileBottomNav from './MobileBottomNav'
import CategoryTabs from './CategoryTabs'
import HeroCarousel from './HeroCarousel'

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

/* =========================
   GET POSTS
========================= */

async function getPosts(): Promise<Post[]> {
  return client.fetch(
    `
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        metaDescription,
        mainImage,
        "categories": categories[]->title
      }
    `,
    {},
    {
      cache: 'no-store',
    }
  )
}

/* =========================
   FORMAT DATE
========================= */

function formatDate(date?: string) {
  if (!date) return ''

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

/* =========================
   HOME PAGE
========================= */

export default async function Home() {
  const posts = await getPosts()

  /* =========================
     HERO SLIDER
     Latest 4 posts
  ========================= */

  const featuredPosts = posts.slice(0, 4)

  const heroPosts = featuredPosts.map(
    (post) => ({
      _id: post._id,

      title: post.title,

      slug: post.slug.current,

      publishedAt:
        post.publishedAt,

      imageUrl:
        post.mainImage?.asset
          ? urlFor(post.mainImage)
              .width(960)
              .height(660)
              .auto('format')
              .url()
          : undefined,

      imageSrcSet:
        post.mainImage?.asset
          ? [
              `${urlFor(post.mainImage).width(640).height(440).auto('format').url()} 640w`,
              `${urlFor(post.mainImage).width(960).height(660).auto('format').url()} 960w`,
              `${urlFor(post.mainImage).width(1400).height(963).auto('format').url()} 1400w`,
            ].join(', ')
          : undefined,

      imageAlt:
        post.mainImage?.alt,
    })
  )

  /* =========================
     TRENDING + LATEST
  ========================= */

  const trendingPosts =
    posts.slice(0, 3)

  const latestPosts =
    posts.slice(1)

  /* =========================
     CATEGORY POSTS
  ========================= */

  const categoryPosts = posts.map(
    (post) => ({
      _id: post._id,

      title: post.title,

      slug: post.slug,

      publishedAt:
        post.publishedAt,

      metaDescription:
        post.metaDescription,

      categories:
        post.categories,

      imageUrl:
        post.mainImage?.asset
          ? urlFor(post.mainImage)
              .width(900)
              .height(560)
              .auto('format')
              .url()
          : undefined,

      imageAlt:
        post.mainImage?.alt,
    })
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* =========================
          HEADER
      ========================= */}

      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-black/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[88px]">

          {/* LOGO */}

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
              className="text-red-500"
            >
              Home
            </Link>

            <a
              href="#latest"
              className="transition hover:text-white"
            >
              Latest
            </a>

            <a
              href="#categories"
              className="transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="#trending"
              className="transition hover:text-white"
            >
              Trending
            </a>

          </nav>

          {/* SEARCH + MOBILE MENU */}

          <HeaderActions />

        </div>

      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">

        {/* RED BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(220,0,25,0.18),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:py-14 lg:min-h-[560px] lg:grid-cols-[0.9fr_1.1fr] lg:py-16">

          {/* =========================
              HERO TEXT
          ========================= */}

          <div className="relative z-10">

            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">

              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-600 shadow-[0_0_15px_rgba(239,0,30,0.9)]" />

              <span>
                Real Stories. No Filters.
              </span>

            </div>

            <h1 className="max-w-3xl text-[38px] font-black leading-[1.03] tracking-[-0.04em] sm:text-5xl lg:text-[64px]">

              Celebrity News,

              <br />

              Trending Stories &

              <br />

              <span className="text-[#ff1734]">
                Exclusive Updates
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">

              CelebSpike brings you the latest celebrity news, photos,
              entertainment updates and trending stories from around the
              world — all in one place.

            </p>

            <a
              href="#trending"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#f3132d] px-7 py-3.5 text-sm font-bold shadow-[0_10px_40px_rgba(240,0,30,0.28)] transition hover:bg-red-500"
            >

              Explore Now

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>

            </a>

          </div>

          {/* =========================
              WORKING HERO CAROUSEL
          ========================= */}

          <HeroCarousel
            posts={heroPosts}
          />

        </div>

      </section>

      {/* =========================
          CATEGORY BUTTONS
      ========================= */}

      <CategoryTabs
        posts={categoryPosts}
      />

      {/* =========================
          TRENDING
      ========================= */}

      <section
        id="trending"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:py-14"
      >

        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <span className="h-9 w-1.5 rounded-full bg-red-500" />

            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Trending Now
            </h2>

          </div>

          <a
            href="#latest"
            className="flex items-center gap-1 text-xs font-bold text-red-500 sm:text-sm"
          >

            See All

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>

          </a>

        </div>

        {trendingPosts.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-8 text-sm text-zinc-500">
            No posts published yet.
          </div>

        ) : (

          <div className="grid gap-4 lg:grid-cols-3">

            {trendingPosts.map(
              (post, index) => (

                <article
                  key={post._id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0c0c] to-[#080808] transition hover:border-red-500/30"
                >

                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="flex h-full"
                  >

                    {/* IMAGE */}

                    <div className="relative w-[38%] shrink-0 overflow-hidden bg-zinc-900 lg:w-[42%]">

                      {post.mainImage?.asset ? (

                        <img
                          src={
                            urlFor(
                              post.mainImage
                            )
                              .width(480)
                              .height(400)
                              .auto('format')
                              .url()
                          }
                          alt={
                            post.mainImage.alt ||
                            post.title
                          }
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-black" />

                      )}

                      <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-black shadow-lg">
                        {index + 1}
                      </span>

                    </div>

                    {/* CONTENT */}

                    <div className="flex min-h-[145px] min-w-0 flex-1 flex-col justify-center p-4">

                      {post.categories?.[0] && (

                        <span className="mb-2 w-fit rounded-md bg-red-950/60 px-2 py-1 text-[9px] font-bold uppercase text-red-400">
                          {post.categories[0]}
                        </span>

                      )}

                      <h3 className="line-clamp-3 text-[15px] font-bold leading-snug sm:text-lg">
                        {post.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500 sm:text-xs">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3.5 w-3.5"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path d="M12 7v5l3 2" />
                        </svg>

                        <span>
                          {formatDate(
                            post.publishedAt
                          )}
                        </span>

                      </div>

                    </div>

                  </Link>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {/* =========================
          LATEST
      ========================= */}

      <section
        id="latest"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-28 pt-3 sm:px-6 lg:pb-20"
      >

        <div className="mb-7">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Stay Updated
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Latest Stories
          </h2>

        </div>

        {latestPosts.length === 0 ? (

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-7 text-sm text-zinc-500">
            Publish more posts to see them here.
          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {latestPosts.map(
              (post) => (

                <article
                  key={post._id}
                  className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0b0b0b] transition hover:-translate-y-1 hover:border-red-500/30"
                >

                  <Link
                    href={`/blog/${post.slug.current}`}
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">

                      {post.mainImage?.asset ? (

                        <img
                          src={
                            urlFor(
                              post.mainImage
                            )
                              .width(900)
                              .height(560)
                              .url()
                          }
                          alt={
                            post.mainImage.alt ||
                            post.title
                          }
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-950 to-black text-sm font-bold text-zinc-600">
                          CELEBSPIKE
                        </div>

                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      {post.categories?.[0] && (

                        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-red-500">
                          {post.categories[0]}
                        </p>

                      )}

                      <h3 className="text-lg font-bold leading-snug transition group-hover:text-red-400">
                        {post.title}
                      </h3>

                      {post.metaDescription && (

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                          {post.metaDescription}
                        </p>

                      )}

                      <div className="mt-5 flex items-center justify-between">

                        <span className="text-[11px] text-zinc-600">
                          {formatDate(
                            post.publishedAt
                          )}
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

              )
            )}

          </div>

        )}

      </section>

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
            © {new Date().getFullYear()} Celebspike. All rights reserved.
          </p>

        </div>

      </footer>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}

      <MobileBottomNav />

    </main>
  )
}