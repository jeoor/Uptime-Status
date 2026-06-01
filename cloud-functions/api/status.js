/**
 * API 代理实现
 * 用于代理 UptimeRobot API 请求，避免跨域问题
 */

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
    const body = await context.request.json()

    // 只请求必要的字段，减少响应大小
    const params = new URLSearchParams()
    params.append('api_key', body.api_key)
    params.append('format', 'json')
    params.append('all_time_uptime_ratio', '1')
    params.append('custom_uptime_ranges', body.custom_uptime_ranges || '')
    params.append('logs', '1')

    if (body.response_times) {
      params.append('response_times', '1')
      params.append('response_times_start_date', body.response_times_start_date || '')
      params.append('response_times_end_date', body.response_times_end_date || '')
    }

    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const result = await response.json()
    return json(result)

  } catch (error) {
    console.error('[cloud-functions/api/status] fetch failed', error)
    return json({ stat: 'fail', message: error.message }, 500)
  }
}
