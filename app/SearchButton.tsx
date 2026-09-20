'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'

export default function SearchButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const value = query.trim()

    if (!value) return

    setOpen(false)
    document.body.style.overflow = ''

    router.push(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <>
      {/* SEARCH ICON */}
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className="relative z-[60] flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-200 transition active:bg-white/10 hover:bg-white/10"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none h-5 w-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {/* SEARCH MODAL */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-[#050505]/98 backdrop-blur-xl">

          {/* TOP BAR */}
          <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-4">

            <span className="text-sm font-black uppercase tracking-[0.18em] text-red-500">
              Search
            </span>

            <button
              type="button"
              aria-label="Close search"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white active:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none h-6 w-6"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>

          </div>

          {/* SEARCH CONTENT */}
          <div className="mx-auto w-full max-w-2xl px-4 pt-10 sm:px-6 sm:pt-16">

            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-red-500">
              CelebSpike Search
            </p>

            <h2 className="mb-7 text-3xl font-black tracking-tight text-white sm:text-4xl">
              What are you looking for?
            </h2>

            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] focus-within:border-red-500"
            >

              <div className="flex items-center">

                <div className="pl-4 text-zinc-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-5 w-5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>

                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search celebrity stories..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-5 text-base text-white outline-none placeholder:text-zinc-600"
                />

              </div>

              {/* MOBILE FRIENDLY SEARCH BUTTON */}
              <div className="border-t border-white/[0.07] p-2">

                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f3132d] px-5 py-3.5 text-sm font-black text-white transition active:scale-[0.98] hover:bg-red-500"
                >
                  Search Stories

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

                </button>

              </div>

            </form>

            <p className="mt-5 text-xs leading-5 text-zinc-600">
              Search celebrity news, entertainment and trending stories.
            </p>

          </div>

        </div>
      )}
    </>
  )
}