import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const projects = await sql`SELECT * FROM projects ORDER BY display_order ASC, id ASC`
    return NextResponse.json(projects)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const sql = getDb()
    const body = await request.json()
    const { title, description, url, status, tags, image_url, emoji, banner_color, display_order, is_active } = body

    const result = await sql`
      INSERT INTO projects (title, description, url, status, tags, image_url, emoji, banner_color, display_order, is_active)
      VALUES (
        ${title}, ${description || null}, ${url || null}, ${status || 'LIVE'},
        ${tags || []}, ${image_url || null}, ${emoji || '🚀'}, ${banner_color || '#0A1628'},
        ${display_order || 0}, ${is_active !== false}
      )
      RETURNING *
    `
    // Revalidate homepage to show new project
    revalidatePath('/', 'layout')
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
