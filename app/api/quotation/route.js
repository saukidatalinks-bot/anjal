import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

function makeReference(prefix = 'AS') {
  const now = new Date()
  return `${prefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-6)}`
}

export async function POST(request) {
  try {
    const sql = getDb()
    const body = await request.json()
    const {
      client_name,
      entity_name,
      email,
      phone,
      address,
      selected_items = [],
      total_amount = 0,
      total_naira = null,
      notes,
      project_title,
      client_payload = {},
      proposal_payload = {},
      quote_type = 'project',
      source = 'quote-builder',
    } = body

    if (!client_name || !email) {
      return NextResponse.json({ error: 'Client name and email are required' }, { status: 400 })
    }

    const nairaValue = Number(total_naira ?? total_amount ?? 0)
    const ref = makeReference('AS')

    await sql`
      INSERT INTO quotation_requests (
        reference, quote_type, project_title, client_name, entity_name, email, phone, address,
        selected_items, total_amount, total_naira, currency, notes, client_payload, proposal_payload, source
      )
      VALUES (
        ${ref}, ${quote_type}, ${project_title || null}, ${client_name}, ${entity_name || null},
        ${email}, ${phone || null}, ${address || null}, ${JSON.stringify(selected_items)}::jsonb,
        ${nairaValue}, ${nairaValue}, 'NGN', ${notes || null}, ${JSON.stringify(client_payload)}::jsonb,
        ${JSON.stringify(proposal_payload)}::jsonb, ${source}
      )
    `

    return NextResponse.json({ success: true, reference: ref })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
