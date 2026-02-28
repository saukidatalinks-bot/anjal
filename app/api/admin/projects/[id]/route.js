import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const sql = getDb()
    const result = await sql`SELECT * FROM projects WHERE id = ${params.id}`
    if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const body = await request.json()
    const { title, description, url, status, tags, image_url, emoji, banner_color, display_order, is_active } = body

    const result = await sql`
      UPDATE projects SET
        title = ${title},
        description = ${description || null},
        url = ${url || null},
        status = ${status || 'LIVE'},
        tags = ${tags || []},
        image_url = ${image_url || null},
        emoji = ${emoji || '🚀'},
        banner_color = ${banner_color || '#0A1628'},
        display_order = ${display_order || 0},
        is_active = ${is_active !== false},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `
    if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Revalidate homepage to show updated project
    revalidatePath('/', 'layout')
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    await sql`DELETE FROM projects WHERE id = ${params.id}`
    // Revalidate homepage to remove image
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
