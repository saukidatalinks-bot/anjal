import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const users = await sql`
      SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at
      FROM admin_users
      ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, id
    `
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const sql = getDb()
    const { name, email, password, role, is_active } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const result = await sql`
      INSERT INTO admin_users (name, email, password_hash, role, is_active)
      VALUES (${name}, ${email.toLowerCase()}, ${passwordHash}, ${role || 'admin'}, ${is_active !== false})
      RETURNING id, name, email, role, is_active, last_login_at, created_at, updated_at
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
