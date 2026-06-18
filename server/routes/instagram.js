const { Router } = require('express')
const https = require('https')

const router = Router()

// In-memory cache: { data, expiresAt }
let cache = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

function fetchInstagramFeed() {
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID } = process.env
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    return Promise.resolve([])
  }

  const fields = 'id,caption,media_url,thumbnail_url,media_type,permalink,timestamp'
  const url = `/v18.0/${INSTAGRAM_USER_ID}/media?fields=${fields}&limit=12&access_token=${INSTAGRAM_ACCESS_TOKEN}`

  return new Promise((resolve) => {
    const req = https.request(
      { hostname: 'graph.instagram.com', path: url, method: 'GET' },
      (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            if (parsed.data) {
              resolve(parsed.data.filter((p) => p.media_type !== 'VIDEO'))
            } else {
              console.error('Instagram API error:', parsed.error?.message)
              resolve([])
            }
          } catch {
            resolve([])
          }
        })
      }
    )
    req.on('error', () => resolve([]))
    req.end()
  })
}

// GET /api/instagram/feed
router.get('/feed', async (req, res) => {
  try {
    const now = Date.now()
    if (cache && cache.expiresAt > now) {
      return res.json(cache.data)
    }

    const data = await fetchInstagramFeed()
    cache = { data, expiresAt: now + CACHE_TTL_MS }
    res.json(data)
  } catch {
    res.json([])
  }
})

module.exports = router
