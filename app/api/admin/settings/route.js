import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const settings = await sql`SELECT key, value FROM settings`
  return NextResponse.json(Object.fromEntries(settings.map(s => [s.key, s.value])))
}

export async function POST(request) {
  try {
    const sql = getDb()
    const updates = await request.json()
    for (const [key, value] of Object.entries(updates)) {
      await sql`
        INSERT INTO settings (key, value, updated_at) VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `
    }
    // Revalidate homepage so updated settings show immediately
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
