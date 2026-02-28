import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const submissions = await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`
  return NextResponse.json(submissions)
}

export async function PUT(request) {
  try {
    const sql = getDb()
    const { id } = await request.json()
    await sql`UPDATE contact_submissions SET is_read = true WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id === 'all') {
      await sql`DELETE FROM contact_submissions`
    } else {
      await sql`DELETE FROM contact_submissions WHERE id = ${id}`
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
