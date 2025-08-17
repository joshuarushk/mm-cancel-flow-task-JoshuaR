import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const has = req.cookies.get('csrf_token')
  if (!has) {
    res.cookies.set('csrf_token', cryptoRandom(), { httpOnly: true, sameSite: 'lax', secure: true, path: '/' })
  }
  return res
}

function cryptoRandom() {
  // short random token
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  // fallback
  return Math.random().toString(36).slice(2)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
