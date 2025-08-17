import { cookies, headers } from 'next/headers'
import crypto from 'node:crypto'

const CSRF_COOKIE = 'csrf_token'

export function ensureCsrfToken(): string {
  const store = cookies()
  let token = store.get(CSRF_COOKIE)?.value
  if (!token) {
    token = crypto.randomUUID()
    store.set(CSRF_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' })
  }
  return token
}

export function assertCsrf() {
  const store = cookies()
  const token = store.get(CSRF_COOKIE)?.value
  const sent = headers().get('x-csrf')
  if (!token || !sent || token !== sent) {
    throw new Response('CSRF validation failed', { status: 403 })
  }
}
