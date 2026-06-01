/**
 * API 代理实现 - 代理 UptimeRobot API 请求，避免跨域问题
 */

// 内存缓存，减少重复请求
let cache = null
let cacheTime = 0
const CACHE_TTL = 60_000

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
    },
  })
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
    },
  })
}

export async function onRequestPost(context) {
  try {
    const now = Date.now()

    if (cache && (now - cacheTime) < CACHE_TTL) {
      return json(cache)
    }

    const body = await context.request.json()

    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    cache = data
    cacheTime = now

    return json(data)

  } catch (error) {
    console.error('[cloud-functions/api/status]', error)
    if (cache) return json(cache)
    return json({ stat: 'fail', message: error.message }, 500)
  }
}
