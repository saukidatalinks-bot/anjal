import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

function toNumber(value) {
  return parseFloat(value || 0)
}

export async function POST(request, { params }) {
  try {
    await initDb()
    const sql = getDb()

    const slug = (params?.slug || '').toLowerCase().trim()
    if (!slug) {
      return NextResponse.json({ error: 'Client slug is required' }, { status: 400 })
    }

    const body = await request.json()
    const phase = (body?.payment_phase || '').toLowerCase().trim()
    const paidAmount = toNumber(body?.paid_amount)
    const transferReference = (body?.transfer_reference || '').trim()
    const receiptUrl = (body?.receipt_url || '').trim()

    if (!['initial', 'final'].includes(phase)) {
      return NextResponse.json({ error: 'Invalid payment phase' }, { status: 400 })
    }

    if (!receiptUrl) {
      return NextResponse.json({ error: 'Receipt image is required' }, { status: 400 })
    }

    const clientRows = await sql`
      SELECT * FROM clients
      WHERE slug = ${slug} AND is_active = true
      LIMIT 1
    `

    if (!clientRows.length) {
      return NextResponse.json({ error: 'Client portal not found' }, { status: 404 })
    }

    const client = clientRows[0]
    const expectedAmount = Math.round(toNumber(client.total_amount) / 2)

    const existingSamePhase = await sql`
      SELECT id, status FROM client_payments
      WHERE client_id = ${client.id}
        AND payment_phase = ${phase}
        AND status IN ('pending', 'verified')
      LIMIT 1
    `

    if (existingSamePhase.length) {
      return NextResponse.json({ error: 'A payment for this phase is already pending or verified' }, { status: 409 })
    }

    if (phase === 'final') {
      const initialVerified = await sql`
        SELECT id FROM client_payments
        WHERE client_id = ${client.id}
          AND payment_phase = 'initial'
          AND status = 'verified'
        LIMIT 1
      `

      if (!initialVerified.length) {
        return NextResponse.json({ error: 'Initial payment must be verified before final payment' }, { status: 400 })
      }

      if (!client.allow_final_payment) {
        return NextResponse.json({ error: 'Final payment is locked until admin milestone upgrade' }, { status: 400 })
      }
    }

    const insert = await sql`
      INSERT INTO client_payments (
        client_id,
        payment_phase,
        expected_amount,
        paid_amount,
        receipt_url,
        transfer_reference,
        status,
        submitted_at,
        updated_at
      ) VALUES (
        ${client.id},
        ${phase},
        ${expectedAmount},
        ${paidAmount || expectedAmount},
        ${receiptUrl},
        ${transferReference || null},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, payment: insert[0] }, { status: 201 })
  } catch (err) {
    console.error('Client payment submission error:', err)
    return NextResponse.json({ error: 'Failed to submit payment receipt' }, { status: 500 })
  }
}
