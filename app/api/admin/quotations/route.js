import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const quotations = await sql`SELECT * FROM quotation_requests ORDER BY created_at DESC`
  return NextResponse.json(quotations)
}

export async function DELETE(request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    await sql`DELETE FROM quotation_requests WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
