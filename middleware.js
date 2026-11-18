import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getJwtSecretBytes } from '@/lib/jwt'

function extractCookie(request, name) {
  const cookieHeader = request.headers.get('cookie') || ''
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    if (key === name) return trimmed.slice(eqIndex + 1)
  }
  return ''
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isAdminApi = pathname.startsWith('/api/admin')

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next()
  }

  const token = extractCookie(request, 'admin_token')
  if (!token) {
    return isAdminApi
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, getJwtSecretBytes())
    return NextResponse.next()
  } catch {
    return isAdminApi
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
