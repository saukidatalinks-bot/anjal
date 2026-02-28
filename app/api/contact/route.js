import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(request) {
  try {
    const sql = getDb()
    const { name, email, phone, service, budget, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    await sql`
      INSERT INTO contact_submissions (name, email, phone, service, budget, message)
      VALUES (${name}, ${email}, ${phone||null}, ${service||null}, ${budget||null}, ${message})
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
