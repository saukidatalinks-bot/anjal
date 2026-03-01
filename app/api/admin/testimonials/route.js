import { getDb } from '@/lib/db'

// GET all testimonials (pending and approved)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'pending' or 'approved'
    const sql = getDb()

    let result
    if (status === 'pending') {
      result = await sql`
        SELECT id, name, email, company, role, message, rating, is_approved, created_at 
        FROM testimonials 
        WHERE is_approved = false 
        ORDER BY created_at DESC
      `
    } else if (status === 'approved') {
      result = await sql`
        SELECT id, name, email, company, role, message, rating, is_approved, created_at 
        FROM testimonials 
        WHERE is_approved = true 
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT id, name, email, company, role, message, rating, is_approved, created_at 
        FROM testimonials 
        ORDER BY created_at DESC
      `
    }

    return Response.json({ testimonials: result })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST create new testimonial (admin manual entry)
export async function POST(req) {
  try {
    const { name, email, company, role, message, rating, is_approved = false } = await req.json()
    const sql = getDb()

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO testimonials (name, email, company, role, message, rating, is_approved) 
      VALUES (${name}, ${email}, ${company || null}, ${role || null}, ${message}, ${rating || 5}, ${is_approved}) 
      RETURNING id, name, email, company, role, message, rating, is_approved, created_at
    `

    return Response.json({ testimonial: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return Response.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
