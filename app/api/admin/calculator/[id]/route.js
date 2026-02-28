import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const { category, name, base_price, multiplier, display_order, is_active } = await request.json()
    const result = await sql`
      UPDATE calculator_items SET category=${category}, name=${name}, base_price=${base_price||0},
        multiplier=${multiplier||1.0}, display_order=${display_order||0}, is_active=${is_active!==false}
      WHERE id = ${params.id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    await sql`DELETE FROM calculator_items WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
