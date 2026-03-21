import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

export async function GET() {
  try {
    await initDb()
    const sql = getDb()

    const clients = await sql`
      SELECT c.*,
        COALESCE(SUM(CASE WHEN cp.status = 'pending' THEN 1 ELSE 0 END), 0)::int AS pending_payments,
        COALESCE(SUM(CASE WHEN cp.status = 'verified' THEN cp.paid_amount ELSE 0 END), 0) AS verified_amount
      FROM clients c
      LEFT JOIN client_payments cp ON cp.client_id = c.id
      GROUP BY c.id
      ORDER BY c.updated_at DESC, c.id DESC
    `

    return NextResponse.json(clients)
  } catch (err) {
    console.error('Admin clients GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request) {
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

    if (!slug || !client_name || !project_title) {
      return NextResponse.json({ error: 'slug, client_name and project_title are required' }, { status: 400 })
    }

    const cleanSlug = slug.toLowerCase().trim()

    const result = await sql`
      INSERT INTO clients (
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
        updated_at
      ) VALUES (
        ${cleanSlug},
        ${client_name},
        ${company_name || null},
        ${contact_email || null},
        ${project_title},
        ${project_description || null},
        ${project_status || 'in_progress'},
        ${total_amount || 0},
        ${currency || 'NGN'},
        ${total_amount_usd || 0},
        ${progress_percent || 0},
        ${current_milestone || 1},
        ${JSON.stringify(milestones_json || [])}::jsonb,
        ${allow_final_payment === true},
        ${is_active !== false},
        ${payment_bank || 'Opay'},
        ${payment_account_number || null},
        ${payment_account_name || null},
        ${payment_note || null},
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    console.error('Admin clients POST error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create client' }, { status: 500 })
  }
}
