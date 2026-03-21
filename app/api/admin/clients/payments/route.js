import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

export async function GET(request) {
  try {
    await initDb()
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')

    const rows = clientId
      ? await sql`
          SELECT cp.*, c.slug, c.client_name, c.project_title
          FROM client_payments cp
          JOIN clients c ON c.id = cp.client_id
          WHERE cp.client_id = ${clientId}
          ORDER BY cp.submitted_at DESC
        `
      : await sql`
          SELECT cp.*, c.slug, c.client_name, c.project_title
          FROM client_payments cp
          JOIN clients c ON c.id = cp.client_id
          ORDER BY cp.submitted_at DESC
        `

    return NextResponse.json(rows)
  } catch (err) {
    console.error('Admin client payments GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch client payments' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await initDb()
    const sql = getDb()
    const body = await request.json()

    const paymentId = body?.payment_id
    const status = (body?.status || '').toLowerCase().trim()
    const adminNote = body?.admin_note || null
    const unlockFinalPayment = body?.unlock_final_payment === true
    const advanceMilestone = body?.advance_milestone === true

    if (!paymentId || !['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'payment_id and valid status are required' }, { status: 400 })
    }

    const paymentRows = await sql`SELECT * FROM client_payments WHERE id = ${paymentId} LIMIT 1`
    if (!paymentRows.length) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const payment = paymentRows[0]

    const updated = await sql`
      UPDATE client_payments SET
        status = ${status},
        admin_note = ${adminNote},
        verified_at = ${status === 'verified' ? sql`NOW()` : null},
        updated_at = NOW()
      WHERE id = ${paymentId}
      RETURNING *
    `

    if (status === 'verified') {
      if (unlockFinalPayment) {
        await sql`
          UPDATE clients
          SET allow_final_payment = true, updated_at = NOW()
          WHERE id = ${payment.client_id}
        `
      }

      if (advanceMilestone) {
        await sql`
          UPDATE clients
          SET
            current_milestone = current_milestone + 1,
            progress_percent = LEAST(100, progress_percent + 25),
            updated_at = NOW()
          WHERE id = ${payment.client_id}
        `
      }

      if (payment.payment_phase === 'final') {
        await sql`
          UPDATE clients
          SET project_status = 'completed', progress_percent = 100, updated_at = NOW()
          WHERE id = ${payment.client_id}
        `
      }
    }

    return NextResponse.json(updated[0])
  } catch (err) {
    console.error('Admin client payments PUT error:', err)
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 })
  }
}

// PATCH /api/admin/clients/payments — mark project complete
export async function PATCH(request) {
  try {
    await initDb()
    const sql = getDb()
    const body = await request.json()
    const clientId = body?.client_id
    const action = body?.action

    if (!clientId || action !== 'mark_complete') {
      return NextResponse.json({ error: 'client_id and action=mark_complete required' }, { status: 400 })
    }

    await sql`
      UPDATE clients SET
        project_completed_at = NOW(),
        project_status = 'completed',
        progress_percent = 100,
        updated_at = NOW()
      WHERE id = ${clientId}
    `
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin mark complete error:', err)
    return NextResponse.json({ error: 'Failed to mark project complete' }, { status: 500 })
  }
}
