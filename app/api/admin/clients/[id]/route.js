import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    await initDb()
    const sql = getDb()

    const rows = await sql`SELECT * FROM clients WHERE id = ${params.id} LIMIT 1`
    if (!rows.length) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const payments = await sql`
      SELECT *
      FROM client_payments
      WHERE client_id = ${params.id}
      ORDER BY submitted_at DESC
    `

    return NextResponse.json({ ...rows[0], payments })
  } catch (err) {
    console.error('Admin client detail GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await initDb()
    const sql = getDb()
    const body = await request.json()

    const {
      slug,
      client_name,
      company_name,
      contact_email,
      project_title,
      project_description,
      project_status,
      total_amount,
      currency,
      total_amount_usd,
      progress_percent,
      current_milestone,
      milestones_json,
      allow_final_payment,
      is_active,
      payment_bank,
      payment_account_number,
      payment_account_name,
      payment_note,
    } = body

    const result = await sql`
      UPDATE clients SET
        slug = ${slug ? slug.toLowerCase().trim() : null},
        client_name = ${client_name},
        company_name = ${company_name || null},
        contact_email = ${contact_email || null},
        project_title = ${project_title},
        project_description = ${project_description || null},
        project_status = ${project_status || 'in_progress'},
        total_amount = ${total_amount || 0},
        currency = ${currency || 'NGN'},
        total_amount_usd = ${total_amount_usd || 0},
        progress_percent = ${progress_percent || 0},
        current_milestone = ${current_milestone || 1},
        milestones_json = ${JSON.stringify(milestones_json || [])}::jsonb,
        allow_final_payment = ${allow_final_payment === true},
        is_active = ${is_active !== false},
        payment_bank = ${payment_bank || 'Opay'},
        payment_account_number = ${payment_account_number || null},
        payment_account_name = ${payment_account_name || null},
        payment_note = ${payment_note || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error('Admin client PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb()
    const sql = getDb()

    await sql`DELETE FROM clients WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin client DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
