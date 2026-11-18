import { NextResponse } from 'next/server'
import { revalidatePlatformData } from '@/lib/cache'
import { getDb, slugify } from '@/lib/db'

async function uniqueSlug(sql, title, preferredSlug, excludeId) {
  const base = slugify(preferredSlug || title) || `project-${excludeId}`
  let candidate = base
  for (let i = 2; i < 50; i++) {
    const rows = await sql`SELECT id FROM projects WHERE slug = ${candidate} AND id <> ${excludeId} LIMIT 1`
    if (!rows.length) return candidate
    candidate = `${base}-${i}`
  }
  return `${base}-${Date.now()}`
}

async function getProject(sql, id) {
  const result = await sql`SELECT * FROM projects WHERE id = ${id}`
  if (!result.length) return null
  const media = await sql`SELECT * FROM project_media WHERE project_id = ${id} ORDER BY display_order, id`
  return { ...result[0], media }
}

export async function GET(request, { params }) {
  try {
    const sql = getDb()
    const project = await getProject(sql, params.id)
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const body = await request.json()
    const {
      title,
      slug,
      description,
      summary,
      url,
      status,
      tags,
      image_url,
      banner_color,
      display_order,
      is_active,
      project_type,
      industry,
      client_name,
      role,
      challenge,
      solution,
      outcomes,
      app_store_url,
      play_store_url,
      featured,
      launched_at,
    } = body

    if (!title) return NextResponse.json({ error: 'Project title is required' }, { status: 400 })
    const finalSlug = await uniqueSlug(sql, title, slug, params.id)
    const result = await sql`
      UPDATE projects SET
        title = ${title},
        slug = ${finalSlug},
        description = ${description || null},
        summary = ${summary || null},
        url = ${url || null},
        status = ${status || 'LIVE'},
        tags = ${tags || []},
        image_url = ${image_url || null},
        banner_color = ${banner_color || '#0A1628'},
        display_order = ${display_order || 0},
        is_active = ${is_active !== false},
        project_type = ${project_type || 'website'},
        industry = ${industry || null},
        client_name = ${client_name || null},
        role = ${role || null},
        challenge = ${challenge || null},
        solution = ${solution || null},
        outcomes = ${outcomes || []},
        app_store_url = ${app_store_url || null},
        play_store_url = ${play_store_url || null},
        featured = ${featured === true},
        launched_at = ${launched_at || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `
    if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (image_url) {
      await sql`
        INSERT INTO project_media (project_id, media_type, url, alt, orientation, display_order, is_primary)
        SELECT ${params.id}, 'image', ${image_url}, ${title}, 'landscape', 0, true
        WHERE NOT EXISTS (
          SELECT 1 FROM project_media WHERE project_id = ${params.id} AND url = ${image_url}
        )
      `
    }

    revalidatePlatformData()
    return NextResponse.json(await getProject(sql, params.id))
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    await sql`DELETE FROM projects WHERE id = ${params.id}`
    revalidatePlatformData()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
