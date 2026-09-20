'use client'

import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {useRouter} from 'next/navigation'

export default function HeaderActions() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (searchOpen || menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [searchOpen, menuOpen])

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    const value = query.trim()

    if (!value) return

    setSearchOpen(false)

    router.push(
      `/search?q=${encodeURIComponent(value)}`
    )
  }

  const searchModal =
    mounted && searchOpen
      ? createPortal(
          <div className="fixed inset-0 z-[999999] overflow-y-auto bg-[#050505] text-white">

            {/* SEARCH HEADER */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-black">

              <div className="mx-auto flex h-[76px] max-w-3xl items-center justify-between px-4 sm:h-[88px] sm:px-6">

                <img
                  src="/celebspike-logo.png"
                  alt="Celebspike"
                  className="w-[180px] sm:w-[220px]"
                />

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-6 w-6"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>

              </div>

            </div>

            {/* SEARCH BODY */}
            <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">

              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500">
                CelebSpike Search
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Search Stories
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Find celebrity news, entertainment and trending stories.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101010] focus-within:border-red-500"
              >

                <div className="flex items-center">

                  <div className="pl-5 text-zinc-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="h-5 w-5"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                      />

                      <path d="m20 20-3.5-3.5" />
                    </svg>
                  </div>

                  <input
                    autoFocus
                    type="search"
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    placeholder="Search celebrity stories..."
                    className="min-w-0 flex-1 bg-transparent px-4 py-5 text-base text-white outline-none placeholder:text-zinc-600"
                  />

                </div>

                <div className="border-t border-white/[0.07] p-2">

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 px-5 py-4 text-sm font-black text-white transition hover:bg-red-500 active:scale-[0.99]"
                  >
                    Search Stories
                  </button>

                </div>

              </form>

            </div>

          </div>,
          document.body
        )
      : null

  const mobileMenu =
    mounted && menuOpen
      ? createPortal(
          <div className="fixed inset-0 z-[999999] overflow-y-auto bg-[#050505] text-white lg:hidden">

            {/* MENU HEADER */}
            <div className="border-b border-white/10 bg-black">

              <div className="flex h-[76px] items-center justify-between px-4">

                <img
                  src="/celebspike-logo.png"
                  alt="Celebspike"
                  className="w-[185px]"
                />

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-6 w-6"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>

              </div>

            </div>

            {/* MENU LINKS */}
            <nav className="px-5 py-7">

              <a
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-5 text-xl font-black text-red-500"
              >
                <span>Home</span>

                <span className="text-red-500">
                  →
                </span>
              </a>

              <a
                href="/#latest"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-5 text-xl font-black transition hover:text-red-500"
              >
                <span>Latest</span>
                <span>→</span>
              </a>

              <a
                href="/#categories"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-5 text-xl font-black transition hover:text-red-500"
              >
                <span>Categories</span>
                <span>→</span>
              </a>

              <a
                href="/#trending"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-5 text-xl font-black transition hover:text-red-500"
              >
                <span>Trending</span>
                <span>→</span>
              </a>

            </nav>

          </div>,
          document.body
        )
      : null

  return (
    <>
      {/* HEADER ACTIONS */}
      <div className="flex shrink-0 items-center gap-2">

        {/* SEARCH BUTTON */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            setMenuOpen(false)
            setSearchOpen(true)
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white transition hover:bg-white/10 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => {
            setSearchOpen(false)
            setMenuOpen(true)
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/[0.06] active:scale-95 lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-7 w-7"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

      </div>

      {searchModal}
      {mobileMenu}
    </>
  )
}