import { getDb } from '@/lib/db'

// PUT - Update testimonial (allows editing all fields)
export async function PUT(req, { params }) {
  try {
    const { id } = params
    const body = await req.json()
    const sql = getDb()

    // Allow updating any of these fields
    const { name, email, company, role, message, rating, is_approved } = body

    // If only is_approved is provided, just toggle approval
    if (Object.keys(body).length === 1 && is_approved !== undefined) {
      const result = await sql`
        UPDATE testimonials 
        SET is_approved = ${is_approved}, updated_at = NOW() 
        WHERE id = ${id} 
        RETURNING *
      `

      if (result.length === 0) {
        return Response.json({ error: 'Testimonial not found' }, { status: 404 })
      }

      console.log(`[API] Testimonial ${id} approval toggled to ${is_approved}`)
      return Response.json({ testimonial: result[0] })
    }

    // Full update with all provided fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE testimonials 
      SET 
        name = ${name},
        email = ${email},
        company = ${company || null},
        role = ${role || null},
        message = ${message},
        rating = ${rating || 5},
        is_approved = ${is_approved !== undefined ? is_approved : sql`is_approved`},
        updated_at = NOW()
      WHERE id = ${id} 
      RETURNING *
    `

    if (result.length === 0) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    console.log(`[API] Testimonial ${id} updated`)
    return Response.json({ testimonial: result[0] })
  } catch (error) {
    console.error('[API] Error updating testimonial:', error)
    return Response.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE testimonial
export async function DELETE(req, { params }) {
  try {
    const { id } = params
    const sql = getDb()

    const result = await sql`
      DELETE FROM testimonials 
      WHERE id = ${id} 
      RETURNING id, name
    `

    if (result.length === 0) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    console.log(`[API] Testimonial ${id} (${result[0].name}) deleted successfully`)
    return Response.json({ message: 'Testimonial deleted successfully', id: result[0].id })
  } catch (error) {
    console.error('[API] Error deleting testimonial:', error)
    return Response.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
