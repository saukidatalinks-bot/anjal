import { NextResponse } from 'next/server'
import { verifyAdminPassword, signToken, setAdminCookie } from '@/lib/auth'
import { initDb, seedDefaults } from '@/lib/db'

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const valid = await verifyAdminPassword(password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Initialize DB and seed defaults on first admin login
    try {
      await initDb()
      await seedDefaults()
    } catch (e) {
      console.error('DB init error:', e)
    }

    const token = await signToken({ role: 'admin', iat: Date.now() })
    const response = NextResponse.json({ success: true })
    setAdminCookie(response, token)
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
