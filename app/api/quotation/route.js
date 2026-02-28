import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(request) {
  try {
    const sql = getDb()
    const { client_name, entity_name, email, phone, address, selected_items, total_amount, notes } = await request.json()

    await sql`
      INSERT INTO quotation_requests (client_name, entity_name, email, phone, address, selected_items, total_amount, notes)
      VALUES (${client_name}, ${entity_name||null}, ${email||null}, ${phone||null}, ${address||null}, ${JSON.stringify(selected_items)||'[]'}, ${total_amount||0}, ${notes||null})
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
