'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import HeaderActions from '../HeaderActions'
import MobileBottomNav from '../MobileBottomNav'

type SavedPost = {
  slug: string
  title: string
  image?: string
  description?: string
  publishedAt?: string
  savedAt: string
}

const STORAGE_KEY = 'celebspike-saved-posts'

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

export default function SavedPage() {
  const [posts, setPosts] = useState<SavedPost[]>([])
  const [loaded, setLoaded] = useState(false)

  function loadSavedPosts() {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY)

      const savedPosts: SavedPost[] = stored
        ? JSON.parse(stored)
        : []

      setPosts(savedPosts)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setPosts([])
    }

    setLoaded(true)
  }

  useEffect(() => {
    loadSavedPosts()

    window.addEventListener(
      'celebspike-saved-updated',
      loadSavedPosts
    )

    window.addEventListener(
      'storage',
      loadSavedPosts
    )

    return () => {
      window.removeEventListener(
        'celebspike-saved-updated',
        loadSavedPosts
      )

      window.removeEventListener(
        'storage',
        loadSavedPosts
      )
    }
  }, [])

  function removePost(slug: string) {
    const updated = posts.filter(
      (post) => post.slug !== slug
    )

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    )

    setPosts(updated)

    window.dispatchEvent(
      new Event('celebspike-saved-updated')
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-28 text-white lg:pb-0">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[88px]">

          <Link href="/">
            <img
              src="/celebspike-logo.png"
              alt="Celebspike"
              className="w-[185px] sm:w-[220px] lg:w-[245px]"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 lg:flex">
            <Link href="/">
              Home
            </Link>

            <Link href="/#latest">
              Latest
            </Link>

            <Link href="/#categories">
              Categories
            </Link>

            <Link href="/#trending">
              Trending
            </Link>
          </nav>

          <HeaderActions />

        </div>

      </header>

      {/* PAGE TITLE */}
      <section className="border-b border-white/[0.06] bg-[#080808]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Your Collection
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Saved Stories
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Stories you bookmarked for later.
          </p>

        </div>

      </section>

      {/* SAVED POSTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {!loaded ? (
          <p className="text-sm text-zinc-500">
            Loading saved stories...
          </p>
        ) : posts.length === 0 ? (

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0b0b0b] px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-7 w-7"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>

            </div>

            <h2 className="mt-5 text-xl font-black">
              No saved stories yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Save a story and it will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
            >
              Explore Stories
            </Link>

          </div>

        ) : (

          <>
            <div className="mb-7 flex items-center justify-between">

              <h2 className="text-xl font-black">
                Your Bookmarks
              </h2>

              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold text-zinc-500">
                {posts.length}{' '}
                {posts.length === 1
                  ? 'Story'
                  : 'Stories'}
              </span>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (

                <article
                  key={post.slug}
                  className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0b0b0b]"
                >

                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >

                    <div className="aspect-[16/10] overflow-hidden bg-zinc-900">

                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-950 to-black text-xs font-black tracking-[0.2em] text-zinc-600">
                          CELEBSPIKE
                        </div>
                      )}

                    </div>

                    <div className="p-5">

                      <h2 className="line-clamp-2 text-lg font-bold leading-snug group-hover:text-red-400">
                        {post.title}
                      </h2>

                      {post.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                          {post.description}
                        </p>
                      )}

                      {post.publishedAt && (
                        <p className="mt-4 text-[11px] text-zinc-600">
                          {formatDate(
                            post.publishedAt
                          )}
                        </p>
                      )}

                    </div>

                  </Link>

                  <div className="border-t border-white/[0.07] p-3">

                    <button
                      type="button"
                      onClick={() =>
                        removePost(post.slug)
                      }
                      className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-xs font-bold text-zinc-400 transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      Remove from Saved
                    </button>

                  </div>

                </article>

              ))}

            </div>
          </>

        )}

      </section>

      <MobileBottomNav />

    </main>
  )
}