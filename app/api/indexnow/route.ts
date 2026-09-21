import {NextRequest, NextResponse} from 'next/server'

const INDEXNOW_KEY = '8c48feb998424bcd8936a1c57b77c8c9'
const SITE_URL = 'https://www.celebspike.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const slug =
      typeof body?.slug === 'string'
        ? body.slug
        : body?.slug?.current

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing post slug',
        },
        {status: 400},
      )
    }

    const cleanSlug = slug
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')

    const articleUrl = `${SITE_URL}/blog/${cleanSlug}`

    const indexNowResponse = await fetch(
      'https://api.indexnow.org/indexnow',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },

        body: JSON.stringify({
          host: 'www.celebspike.com',

          key: INDEXNOW_KEY,

          keyLocation:
            `${SITE_URL}/${INDEXNOW_KEY}.txt`,

          urlList: [
            articleUrl,
          ],
        }),

        cache: 'no-store',
      },
    )

    if (!indexNowResponse.ok) {
      const responseText =
        await indexNowResponse.text()

      console.error(
        'IndexNow submission failed:',
        indexNowResponse.status,
        responseText,
      )

      return NextResponse.json(
        {
          success: false,
          error: 'IndexNow submission failed',
          status: indexNowResponse.status,
        },
        {status: 502},
      )
    }

    return NextResponse.json({
      success: true,
      submitted: articleUrl,
      indexNowStatus: indexNowResponse.status,
    })
  } catch (error) {
    console.error(
      'IndexNow webhook error:',
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid webhook request',
      },
      {status: 400},
    )
  }
}