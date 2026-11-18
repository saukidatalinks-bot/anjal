import { NextResponse } from 'next/server'
import { revalidatePlatformData } from '@/lib/cache'
import { getDb, initDb, seedDefaults, slugify } from '@/lib/db'

async function uniqueSlug(sql, title, preferredSlug) {
  const base = slugify(preferredSlug || title) || `project-${Date.now()}`
  let candidate = base
  for (let i = 2; i < 50; i++) {
    const rows = await sql`SELECT id FROM projects WHERE slug = ${candidate} LIMIT 1`
    if (!rows.length) return candidate
    candidate = `${base}-${i}`
  }
  return `${base}-${Date.now()}`
}

async function attachMedia(sql, projects) {
  if (!projects.length) return projects
  const ids = projects.map(p => p.id)
  const media = await sql`
    SELECT * FROM project_media
    WHERE project_id = ANY(${ids}::int[])
    ORDER BY project_id, display_order, id
  `
  return projects.map(project => ({
    ...project,
    media: media.filter(item => item.project_id === project.id),
  }))
}

export async function GET() {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()
    const projects = await sql`SELECT * FROM projects ORDER BY display_order ASC, id ASC`
    return NextResponse.json(await attachMedia(sql, projects))
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await initDb()
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
    const finalSlug = await uniqueSlug(sql, title, slug)
    const result = await sql`
      INSERT INTO projects (
        title, slug, description, summary, url, status, tags, image_url, banner_color,
        display_order, is_active, project_type, industry, client_name, role, challenge,
        solution, outcomes, app_store_url, play_store_url, featured, launched_at
      )
      VALUES (
        ${title}, ${finalSlug}, ${description || null}, ${summary || null}, ${url || null}, ${status || 'LIVE'},
        ${tags || []}, ${image_url || null}, ${banner_color || '#0A1628'}, ${display_order || 0},
        ${is_active !== false}, ${project_type || 'website'}, ${industry || null}, ${client_name || null},
        ${role || null}, ${challenge || null}, ${solution || null}, ${outcomes || []},
        ${app_store_url || null}, ${play_store_url || null}, ${featured === true}, ${launched_at || null}
      )
      RETURNING *
    `

    if (image_url) {
      await sql`
        INSERT INTO project_media (project_id, media_type, url, alt, orientation, display_order, is_primary)
        VALUES (${result[0].id}, 'image', ${image_url}, ${title}, 'landscape', 0, true)
      `
    }

    revalidatePlatformData()
    return NextResponse.json((await attachMedia(sql, result))[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
