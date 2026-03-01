import { getDb, initDb } from '@/lib/db'
import { headers } from 'next/headers'

export async function POST(request) {
  try {
    await initDb()
    const sql = getDb()

    const body = await request.json()
    const { name, email, company, role, message, rating } = body

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert testimonial with is_approved = false (pending)
    const result = await sql`
      INSERT INTO testimonials (name, email, company, role, message, rating, is_approved)
      VALUES (${name}, ${email}, ${company || null}, ${role || null}, ${message}, ${rating || 5}, false)
      RETURNING id
    `

    return Response.json({
      success: true,
      id: result[0].id,
      message: 'Testimonial submitted successfully. Awaiting approval.'
    })
  } catch (err) {
    console.error('✗ Testimonial submission error:', err)
    return Response.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}
