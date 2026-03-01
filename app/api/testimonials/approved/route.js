import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const result = await sql`
      SELECT id, name, email, company, role, message, rating 
      FROM testimonials 
      WHERE is_approved = true 
      ORDER BY created_at DESC
    `
    return Response.json({ testimonials: result })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
