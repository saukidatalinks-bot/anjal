import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const services = await sql`SELECT * FROM services ORDER BY display_order ASC, id ASC`
  return NextResponse.json(services)
}

export async function POST(request) {
  try {
    const sql = getDb()
    const { name, description, icon, tags, display_order, is_active } = await request.json()
    const result = await sql`
      INSERT INTO services (name, description, icon, tags, display_order, is_active)
      VALUES (${name}, ${description||null}, ${icon||'🌐'}, ${tags||[]}, ${display_order||0}, ${is_active!==false})
      RETURNING *
    `
    // Revalidate homepage to show new service
    revalidatePath('/', 'layout')
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
