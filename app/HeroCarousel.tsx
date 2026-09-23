'use client'

import Link from 'next/link'
import {
  useEffect,
  useRef,
  useState,
} from 'react'

type HeroPost = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  imageUrl?: string
  imageSrcSet?: string
  imageAlt?: string
}

type HeroCarouselProps = {
  posts: HeroPost[]
}

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

export default function HeroCarousel({
  posts,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const totalSlides = posts.length

  useEffect(() => {
    if (totalSlides <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current === totalSlides - 1 ? 0 : current + 1
      )
    }, 5000)

    return () => window.clearInterval(timer)
  }, [totalSlides])

  if (!posts.length) return null

  const previousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? totalSlides - 1 : current - 1
    )
  }

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === totalSlides - 1 ? 0 : current + 1
    )
  }

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current = event.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchEndX.current = event.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) return

    const distance = touchStartX.current - touchEndX.current
    const minimumSwipeDistance = 50

    if (distance > minimumSwipeDistance) nextSlide()
    if (distance < -minimumSwipeDistance) previousSlide()

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div
      className="relative mt-2 min-w-0 lg:mt-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-[26px] border border-white/10 bg-[#101010] shadow-2xl">
        {posts.map((post, index) => {
          const isActive = index === activeIndex

          return (
            <div
              key={post._id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? 'pointer-events-auto translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-4 opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group absolute inset-0 block"
                tabIndex={isActive ? 0 : -1}
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    srcSet={post.imageSrcSet}
                    sizes="(max-width: 1024px) calc(100vw - 32px), 56vw"
                    alt={post.imageAlt || post.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-black" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <span className="mb-3 inline-flex rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    Featured
                  </span>

                  <h2 className="max-w-2xl text-xl font-black leading-tight sm:text-2xl lg:text-3xl">
                    {post.title}
                  </h2>

                  {post.publishedAt && (
                    <p className="mt-3 text-xs text-zinc-400">
                      {formatDate(post.publishedAt)}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          )
        })}

        {totalSlides > 1 && (
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous featured story"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-80 backdrop-blur-md transition hover:bg-red-600 hover:opacity-100 sm:left-4"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        {totalSlides > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next featured story"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-80 backdrop-blur-md transition hover:bg-red-600 hover:opacity-100 sm:right-4"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {totalSlides > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {posts.map((post, index) => (
            <button
              key={post._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show featured story ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'w-7 bg-red-500'
                  : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
