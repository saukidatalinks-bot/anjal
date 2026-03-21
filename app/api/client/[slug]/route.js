import { NextResponse } from 'next/server'
import { getDb, initDb, seedDefaults } from '@/lib/db'

function toNumber(value) {
  return parseFloat(value || 0)
}

export async function GET(request, { params }) {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()

    const slug = (params?.slug || '').toLowerCase().trim()
    if (!slug) {
      return NextResponse.json({ error: 'Client slug is required' }, { status: 400 })
    }

    const clientRows = await sql`
      SELECT * FROM clients
      WHERE LOWER(slug) = LOWER(${slug})
      LIMIT 1
    `

    if (!clientRows.length) {
      return NextResponse.json({ error: 'Client portal not found' }, { status: 404 })
    }

    const client = clientRows[0]

    const payments = await sql`
      SELECT id, payment_phase, expected_amount, paid_amount, receipt_url, transfer_reference, status, admin_note, submitted_at, verified_at
      FROM client_payments
      WHERE client_id = ${client.id}
      ORDER BY submitted_at DESC
    `

    const halfAmount = Math.round(toNumber(client.total_amount) / 2)

    const initialVerified = payments.find(p => p.payment_phase === 'initial' && p.status === 'verified')
    const initialPending = payments.find(p => p.payment_phase === 'initial' && p.status === 'pending')
    const finalVerified = payments.find(p => p.payment_phase === 'final' && p.status === 'verified')
    const finalPending = payments.find(p => p.payment_phase === 'final' && p.status === 'pending')

    const canSubmitInitial = !initialVerified && !initialPending
    const canSubmitFinal = !!initialVerified && client.allow_final_payment && !finalVerified && !finalPending

    return NextResponse.json({
      client: {
        ...client,
        milestones_json: client.milestones_json || [],
      },
      paymentPolicy: {
        totalAmount: toNumber(client.total_amount),
        halfAmount,
        currency: client.currency || 'NGN',
        transfer: {
          bank: client.payment_bank || 'Opay',
          accountNumber: client.payment_account_number || '9024099561',
          accountName: client.payment_account_name || 'Ahmad Muhammad Jawa',
          note: client.payment_note || 'Project lead transfer account. Upload receipt after payment for admin verification.',
        },
      },
      paymentState: {
        canSubmitInitial,
        canSubmitFinal,
        initialVerified: !!initialVerified,
        initialPending: !!initialPending,
        finalVerified: !!finalVerified,
        finalPending: !!finalPending,
      },
      payments,
    })
  } catch (err) {
    console.error('Client dashboard API error:', err)
    return NextResponse.json({ error: 'Failed to load client dashboard' }, { status: 500 })
  }
}
