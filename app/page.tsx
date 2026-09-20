import Link from 'next/link'
import {client, urlFor} from '@/lib/sanity'

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

async function getPosts(): Promise<Post[]> {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      metaDescription,
      mainImage,
      "categories": categories[]->title
    }
  `)
}

export default async function Home() {
  const posts = await getPosts()

  const featured = posts[0]
  const latestPosts = posts.slice(1)

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            CELEB<span className="text-red-500">SPIKE</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <Link href="/">Home</Link>
            <Link href="/category/celebrity">Celebrity</Link>
            <Link href="/category/news">News</Link>
            <Link href="/category/trending">Trending</Link>
          </nav>

          <div className="rounded-full bg-red-500 px-4 py-2 text-xs font-bold">
            TRENDING
          </div>

        </div>
      </header>

      {/* HERO */}
      {featured && (
        <section className="mx-auto max-w-7xl px-5 py-8">

          <Link
            href={`/blog/${featured.slug.current}`}
            className="group relative block min-h-[460px] overflow-hidden rounded-3xl bg-zinc-900"
          >

            {featured.mainImage?.asset && (
              <img
                src={urlFor(featured.mainImage)
                  .width(1600)
                  .height(900)
                  .url()}
                alt={featured.mainImage.alt || featured.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-0 max-w-3xl p-7 md:p-12">

              <span className="mb-4 inline-block rounded-full bg-red-500 px-4 py-2 text-xs font-bold uppercase">
                Featured
              </span>

              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                {featured.title}
              </h1>

              {featured.metaDescription && (
                <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
                  {featured.metaDescription}
                </p>
              )}

              {featured.publishedAt && (
                <p className="mt-5 text-xs text-gray-400">
                  {new Date(featured.publishedAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
              )}

            </div>

          </Link>

        </section>
      )}

      {/* LATEST */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6">

        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Stay Updated
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Latest Stories
            </h2>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10">
            <p className="text-gray-400">
              No posts published yet.
            </p>
          </div>
        ) : latestPosts.length === 0 ? (
          <p className="text-gray-500">
            Publish more posts to see them here.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {latestPosts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
              >

                <Link href={`/blog/${post.slug.current}`}>

                  <div className="aspect-[16/10] overflow-hidden bg-zinc-900">

                    {post.mainImage?.asset ? (
                      <img
                        src={urlFor(post.mainImage)
                          .width(900)
                          .height(560)
                          .url()}
                        alt={post.mainImage.alt || post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-600">
                        Celebspike
                      </div>
                    )}

                  </div>

                  <div className="p-6">

                    {post.categories?.[0] && (
                      <p className="mb-3 text-xs font-bold uppercase text-red-500">
                        {post.categories[0]}
                      </p>
                    )}

                    <h3 className="text-xl font-bold leading-snug transition group-hover:text-red-400">
                      {post.title}
                    </h3>

                    {post.metaDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                        {post.metaDescription}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">

                      <span className="text-xs text-gray-500">
                        {post.publishedAt
                          ? new Date(
                              post.publishedAt
                            ).toLocaleDateString()
                          : ''}
                      </span>

                      <span className="text-sm font-bold text-red-500">
                        Read →
                      </span>

                    </div>

                  </div>

                </Link>

              </article>
            ))}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-10">

          <div className="text-xl font-black">
            CELEB<span className="text-red-500">SPIKE</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Celebrity news, stories and trending updates.
          </p>

          <p className="mt-8 text-xs text-gray-600">
            © {new Date().getFullYear()} Celebspike. All rights reserved.
          </p>

        </div>
      </footer>

    </main>
  )
}