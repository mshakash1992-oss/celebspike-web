'use client'

import {useState} from 'react'
import Link from 'next/link'

type Post = {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt?: string
  metaDescription?: string
  imageUrl?: string
  imageAlt?: string
  categories?: string[]
}

type Category =
  | 'Trending'
  | 'Hollywood'
  | 'Music'
  | 'TV Shows'
  | 'Influencers'

type Props = {
  posts: Post[]
}

const categories: Category[] = [
  'Trending',
  'Hollywood',
  'Music',
  'TV Shows',
  'Influencers',
]

function formatDate(date?: string) {
  if (!date) return ''

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CategoryIcon({name}: {name: Category}) {
  if (name === 'Trending') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 sm:h-7 sm:w-7"
      >
        <path d="M12 22c4.4 0 8-3.6 8-8 0-3.5-2-6.2-5.2-8.7.2 2.2-.7 3.8-2 4.8.1-3.2-1.8-5.9-4.7-8.1.2 3.5-1.9 5.5-3.1 7.4C4.3 10.6 4 12.1 4 14c0 4.4 3.6 8 8 8Z" />
        <path d="M9.5 17.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.1-.6-2-1.7-2.9 0 1-.4 1.6-1 2-.1-1.3-.8-2.3-1.9-3.1.1 1.5-.4 2.4-.4 4Z" />
      </svg>
    )
  }

  if (name === 'Hollywood') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 sm:h-7 sm:w-7"
      >
        <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1L12 2Z" />
      </svg>
    )
  }

  if (name === 'Music') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 sm:h-7 sm:w-7"
      >
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
    )
  }

  if (name === 'TV Shows') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 sm:h-7 sm:w-7"
      >
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="m8 2 4 4 4-4" />
        <path d="m10 10 5 3-5 3v-6Z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-7 sm:w-7"
    >
      <path d="m12 21-9-10 4-6h10l4 6-9 10Z" />
      <path d="M3 11h18" />
      <path d="m8 5 4 16 4-16" />
    </svg>
  )
}

export default function CategoryTabs({posts}: Props) {
  const [active, setActive] = useState<Category>('Trending')

  const filteredPosts =
    active === 'Trending'
      ? posts.slice(0, 6)
      : posts.filter((post) =>
          post.categories?.some(
            (category) =>
              category.toLowerCase() === active.toLowerCase()
          )
        )

  return (
    <>
      {/* CATEGORY BUTTONS */}
      <section
        id="categories"
        className="scroll-mt-24 border-b border-white/[0.06] bg-[#080808]"
      >
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">

          <div className="grid grid-cols-5 gap-2 sm:gap-4">

            {categories.map((category) => {
              const selected = active === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  className={`flex min-h-[82px] cursor-pointer flex-col items-center justify-center rounded-2xl border px-1 text-center transition-all duration-200 sm:min-h-[105px] ${
                    selected
                      ? 'border-red-500 bg-red-950/30 text-red-500 shadow-[0_0_25px_rgba(239,0,35,0.08)]'
                      : 'border-white/10 bg-[#0b0b0b] text-red-500 hover:border-red-500/50 hover:bg-red-950/10'
                  }`}
                >
                  <CategoryIcon name={category} />

                  <span
                    className={`mt-2 text-[10px] font-bold sm:text-sm ${
                      selected ? 'text-white' : 'text-white'
                    }`}
                  >
                    {category}
                  </span>
                </button>
              )
            })}

          </div>
        </div>
      </section>

      {/* CATEGORY RESULTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <span className="h-9 w-1.5 rounded-full bg-red-500" />

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500">
                Browse
              </p>

              <h2 className="text-2xl font-black sm:text-3xl">
                {active}
              </h2>
            </div>

          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-zinc-500">
            {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'Story' : 'Stories'}
          </span>

        </div>

        {filteredPosts.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <CategoryIcon name={active} />
            </div>

            <h3 className="mt-5 text-lg font-black">
              No {active} stories yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Posts published under the {active} category will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0b0b0b] transition hover:-translate-y-1 hover:border-red-500/30"
              >

                <Link href={`/blog/${post.slug.current}`}>

                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">

                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-950 to-black text-xs font-black tracking-widest text-zinc-600">
                        CELEBSPIKE
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[9px] font-black uppercase text-white shadow-lg">
                      {active}
                    </span>

                  </div>

                  <div className="p-5">

                    <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-red-400">
                      {post.title}
                    </h3>

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
    </>
  )
}