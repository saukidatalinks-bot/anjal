import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const { name, description, icon, tags, display_order, is_active } = await request.json()
    const result = await sql`
      UPDATE services SET name=${name}, description=${description||null}, icon=${icon||'🌐'},
        tags=${tags||[]}, display_order=${display_order||0}, is_active=${is_active!==false}
      WHERE id = ${params.id} RETURNING *
    `
    // Revalidate homepage to show updated service
    revalidatePath('/', 'layout')
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    await sql`DELETE FROM services WHERE id = ${params.id}`
    // Revalidate homepage
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
