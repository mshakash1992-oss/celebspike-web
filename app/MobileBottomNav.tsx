'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'

type Tab = 'home' | 'latest' | 'categories' | 'saved'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const [active, setActive] =
    useState<Tab>('home')

  useEffect(() => {
    function updateActive() {
      if (pathname === '/saved') {
        setActive('saved')
        return
      }

      if (pathname !== '/') {
        setActive('home')
        return
      }

      const hash = window.location.hash

      if (hash === '#latest') {
        setActive('latest')
      } else if (hash === '#categories') {
        setActive('categories')
      } else {
        setActive('home')
      }
    }

    updateActive()

    window.addEventListener(
      'hashchange',
      updateActive
    )

    return () => {
      window.removeEventListener(
        'hashchange',
        updateActive
      )
    }
  }, [pathname])

  function goTo(path: string, tab: Tab) {
    setActive(tab)
    window.location.href = path
  }

  const normal =
    'flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-zinc-400 transition-all duration-200'

  const selected =
    'flex w-full flex-col items-center gap-1 rounded-xl bg-red-500/10 py-1.5 text-red-500 transition-all duration-200'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">

      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">

        {/* HOME */}
        <button
          type="button"
          onClick={() =>
            goTo('/', 'home')
          }
          className={
            active === 'home'
              ? selected
              : normal
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={
              active === 'home'
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m3 11 9-8 9 8" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>

          <span className="text-[10px] font-semibold">
            Home
          </span>
        </button>

        {/* LATEST */}
        <button
          type="button"
          onClick={() =>
            goTo('/#latest', 'latest')
          }
          className={
            active === 'latest'
              ? selected
              : normal
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
            />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>

          <span className="text-[10px] font-semibold">
            Latest
          </span>
        </button>

        {/* CATEGORIES */}
        <button
          type="button"
          onClick={() =>
            goTo(
              '/#categories',
              'categories'
            )
          }
          className={
            active === 'categories'
              ? selected
              : normal
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={
              active === 'categories'
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
            />
          </svg>

          <span className="text-[10px] font-semibold">
            Categories
          </span>
        </button>

        {/* SAVED */}
        <button
          type="button"
          onClick={() =>
            goTo('/saved', 'saved')
          }
          className={
            active === 'saved'
              ? selected
              : normal
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={
              active === 'saved'
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
          </svg>

          <span className="text-[10px] font-semibold">
            Saved
          </span>
        </button>

      </div>

    </nav>
  )
}