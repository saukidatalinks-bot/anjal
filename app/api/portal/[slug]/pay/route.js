import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

function toNumber(v) { return parseFloat(v || 0) }

// POST /api/portal/[slug]/pay — submit payment (receipt optional)
export async function POST(request, { params }) {
  try {
    await initDb()
    const sql = getDb()
    const slug = (params?.slug || '').toLowerCase().trim()

    const body = await request.json()
    const phase = (body?.payment_phase || '').toLowerCase()
    const paidAmount = toNumber(body?.paid_amount)
    const transferRef = (body?.transfer_reference || '').trim()
    const receiptUrl = (body?.receipt_url || '').trim()

    if (!['initial', 'final'].includes(phase)) {
      return NextResponse.json({ error: 'Invalid payment phase. Use initial or final.' }, { status: 400 })
    }

    const rows = await sql`
      SELECT * FROM clients WHERE slug = ${slug} AND is_active = true LIMIT 1
    `
    if (!rows.length) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
    const client = rows[0]

    // Prevent duplicate submission
    const existing = await sql`
      SELECT id FROM client_payments
      WHERE client_id = ${client.id} AND payment_phase = ${phase}
        AND status IN ('pending','verified')
      LIMIT 1
    `
    if (existing.length) {
      return NextResponse.json({ error: 'A payment for this phase is already pending or verified' }, { status: 409 })
    }

    if (phase === 'final') {
      const stage1ok = await sql`
        SELECT id FROM client_payments
        WHERE client_id = ${client.id} AND payment_phase = 'initial' AND status = 'verified'
        LIMIT 1
      `
      if (!stage1ok.length) {
        return NextResponse.json({ error: 'First payment must be verified before second payment' }, { status: 400 })
      }
      if (!client.allow_final_payment) {
        return NextResponse.json({ error: 'Second payment is locked. Please wait for admin to unlock it.' }, { status: 400 })
      }
    }

    const expectedAmount = Math.round(toNumber(client.total_amount) / 2)

    await sql`
      INSERT INTO client_payments (
        client_id, payment_phase, expected_amount, paid_amount,
        receipt_url, transfer_reference, status, submitted_at, updated_at
      ) VALUES (
        ${client.id}, ${phase}, ${expectedAmount},
        ${paidAmount || expectedAmount},
        ${receiptUrl || null}, ${transferRef || null},
        'pending', NOW(), NOW()
      )
    `

    // Advance portal_stage to 'progress' if this is first payment
    if (phase === 'initial') {
      await sql`
        UPDATE clients SET portal_stage = 'progress', updated_at = NOW()
        WHERE id = ${client.id} AND (portal_stage = 'review' OR portal_stage IS NULL)
      `
    }

    return NextResponse.json({ success: true, message: 'Payment submitted. Admin will verify shortly.' })
  } catch (err) {
    console.error('Portal pay POST error:', err)
    return NextResponse.json({ error: 'Payment submission failed' }, { status: 500 })
  }
}
