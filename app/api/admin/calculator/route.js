import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const items = await sql`SELECT * FROM calculator_items ORDER BY category, display_order`
  return NextResponse.json(items)
}

export async function POST(request) {
  try {
    const sql = getDb()
    const { category, name, base_price, multiplier, display_order } = await request.json()
    const result = await sql`
      INSERT INTO calculator_items (category, name, base_price, multiplier, display_order)
      VALUES (${category}, ${name}, ${base_price||0}, ${multiplier||1.0}, ${display_order||0})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
