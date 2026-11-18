import { NextResponse } from 'next/server'
import { revalidatePlatformData } from '@/lib/cache'
import { getDb } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const sql = getDb()
    const media = await sql`
      SELECT * FROM project_media
      WHERE project_id = ${params.id}
      ORDER BY display_order, id
    `
    return NextResponse.json(media)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const sql = getDb()
    const { url, alt, orientation, media_type, display_order, is_primary } = await request.json()
    if (!url) return NextResponse.json({ error: 'Media URL is required' }, { status: 400 })

    if (is_primary) {
      await sql`UPDATE project_media SET is_primary = false WHERE project_id = ${params.id}`
    }

    const result = await sql`
      INSERT INTO project_media (project_id, media_type, url, alt, orientation, display_order, is_primary)
      VALUES (${params.id}, ${media_type || 'image'}, ${url}, ${alt || null}, ${orientation || 'landscape'}, ${display_order || 0}, ${is_primary === true})
      RETURNING *
    `
    revalidatePlatformData()
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('mediaId')
    if (!mediaId) return NextResponse.json({ error: 'mediaId is required' }, { status: 400 })
    await sql`DELETE FROM project_media WHERE id = ${mediaId} AND project_id = ${params.id}`
    revalidatePlatformData()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
