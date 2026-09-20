'use client'

import {useEffect, useState} from 'react'

type Props = {
  slug: string
  title: string
  image?: string
  description?: string
  publishedAt?: string
}

export type SavedPost = {
  slug: string
  title: string
  image?: string
  description?: string
  publishedAt?: string
  savedAt: string
}

const STORAGE_KEY = 'celebspike-saved-posts'

export default function SaveButton({
  slug,
  title,
  image,
  description,
  publishedAt,
}: Props) {
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (!stored) return

      const posts: SavedPost[] = JSON.parse(stored)

      setSaved(
        posts.some((post) => post.slug === slug)
      )
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [slug])

  function toggleSave() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      const posts: SavedPost[] = stored
        ? JSON.parse(stored)
        : []

      const alreadySaved = posts.some(
        (post) => post.slug === slug
      )

      if (alreadySaved) {
        const updated = posts.filter(
          (post) => post.slug !== slug
        )

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        )

        setSaved(false)

        window.dispatchEvent(
          new Event('celebspike-saved-updated')
        )

        return
      }

      const newPost: SavedPost = {
        slug,
        title,
        image,
        description,
        publishedAt,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newPost, ...posts])
      )

      setSaved(true)

      window.dispatchEvent(
        new Event('celebspike-saved-updated')
      )
    } catch {
      // Ignore unavailable/corrupted local storage.
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-zinc-400"
      >
        <BookmarkIcon />
        Save
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      aria-pressed={saved}
      className={
        saved
          ? 'inline-flex h-11 items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 text-sm font-bold text-red-500 transition active:scale-95'
          : 'inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-zinc-300 transition hover:border-red-500/30 hover:text-white active:scale-95'
      }
    >
      <BookmarkIcon filled={saved} />

      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

function BookmarkIcon({
  filled = false,
}: {
  filled?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  )
}