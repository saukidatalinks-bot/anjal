import { NextResponse } from 'next/server'
import { getDb, initDb } from '@/lib/db'

function toNumber(v) { return parseFloat(v || 0) }

export async function GET(request, { params }) {
  try {
    await initDb()
    const sql = getDb()
    const slug = (params?.slug || '').toLowerCase().trim()
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 })

    const rows = await sql`
      SELECT * FROM clients WHERE LOWER(slug) = ${slug} AND is_active = true LIMIT 1
    `
    if (!rows.length) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })

    const client = rows[0]

    const payments = await sql`
      SELECT id, payment_phase, expected_amount, paid_amount, receipt_url,
             transfer_reference, status, admin_note, submitted_at, verified_at
      FROM client_payments
      WHERE client_id = ${client.id}
      ORDER BY submitted_at ASC
    `

    const halfAmount = Math.round(toNumber(client.total_amount) / 2)
    const halfUSD = Math.round(toNumber(client.total_amount_usd) / 2)

    const p1 = { verified: null, pending: null }
    const p2 = { verified: null, pending: null }
    for (const p of payments) {
      if (p.payment_phase === 'initial') {
        if (p.status === 'verified') p1.verified = p
        else if (p.status === 'pending') p1.pending = p
      } else if (p.payment_phase === 'final') {
        if (p.status === 'verified') p2.verified = p
        else if (p.status === 'pending') p2.pending = p
      }
    }

    // Stage 1: initial payment
    const stage1Status = p1.verified ? 'verified' : p1.pending ? 'pending' : 'none'
    // Stage 2: final payment (locked until stage1 verified & admin allows)
    const stage2Unlocked = !!p1.verified && !!client.allow_final_payment
    const stage2Status = p2.verified ? 'verified' : p2.pending ? 'pending' : stage2Unlocked ? 'active' : 'locked'
    // Stage 3: completion
    const stage3Unlocked = !!p2.verified
    const stage3Status = client.project_completed_at ? 'complete' : stage3Unlocked ? 'active' : 'locked'

    return NextResponse.json({
      client: {
        id: client.id,
        slug: client.slug,
        client_name: client.client_name,
        company_name: client.company_name,
        project_title: client.project_title,
        project_description: client.project_description,
        project_status: client.project_status,
        portal_stage: client.portal_stage || 'review',
        quotation_content: client.quotation_content || '',
        contract_content: client.contract_content || '',
        total_amount: toNumber(client.total_amount),
        total_amount_usd: toNumber(client.total_amount_usd),
        currency: client.currency || 'NGN',
        progress_percent: client.progress_percent || 0,
      },
      payment: {
        bank: client.payment_bank || 'Opay',
        accountNumber: client.payment_account_number || '',
        accountName: client.payment_account_name || '',
        note: client.payment_note || '',
        halfAmount,
        halfUSD,
        currency: client.currency || 'NGN',
      },
      stages: {
        stage1: { status: stage1Status, payment: p1.verified || p1.pending || null },
        stage2: { status: stage2Status, payment: p2.verified || p2.pending || null },
        stage3: { status: stage3Status, completedAt: client.project_completed_at || null },
      },
    })
  } catch (err) {
    console.error('Portal GET error:', err)
    return NextResponse.json({ error: 'Failed to load portal' }, { status: 500 })
  }
}
