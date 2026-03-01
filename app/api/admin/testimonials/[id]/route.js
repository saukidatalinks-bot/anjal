import { getDb } from '@/lib/db'

// PUT approve/reject testimonial
export async function PUT(req, { params }) {
  try {
    const { id } = params
    const { is_approved } = await req.json()
    const sql = getDb()

    if (is_approved === undefined) {
      return Response.json(
        { error: 'is_approved field is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE testimonials 
      SET is_approved = ${is_approved}, updated_at = NOW() 
      WHERE id = ${id} 
      RETURNING *
    `

    if (result.length === 0) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return Response.json({ testimonial: result[0] })
  } catch (error) {
    console.error('Error updating testimonial:', error)
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
      RETURNING id
    `

    if (result.length === 0) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return Response.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return Response.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
