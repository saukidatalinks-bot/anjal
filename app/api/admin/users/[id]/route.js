import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const { name, email, password, role, is_active } = await request.json()
    const current = await sql`SELECT role FROM admin_users WHERE id = ${params.id}`
    if (!current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let result
    if (password) {
      const passwordHash = await bcrypt.hash(password, 12)
      result = await sql`
        UPDATE admin_users
        SET name = ${name}, email = ${email.toLowerCase()}, password_hash = ${passwordHash},
            role = ${role || current[0].role}, is_active = ${is_active !== false}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, name, email, role, is_active, last_login_at, created_at, updated_at
      `
    } else {
      result = await sql`
        UPDATE admin_users
        SET name = ${name}, email = ${email.toLowerCase()},
            role = ${role || current[0].role}, is_active = ${is_active !== false}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, name, email, role, is_active, last_login_at, created_at, updated_at
      `
    }
    return NextResponse.json(result[0])
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    const owners = await sql`SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'owner' AND is_active = true`
    const user = await sql`SELECT role FROM admin_users WHERE id = ${params.id}`
    if (!user.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (user[0].role === 'owner' && owners[0].count <= 1) {
      return NextResponse.json({ error: 'At least one active owner is required' }, { status: 400 })
    }
    await sql`DELETE FROM admin_users WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
