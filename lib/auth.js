import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { getJwtSecretBytes } from '@/lib/jwt'

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecretBytes())
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes())
    return payload
  } catch {
    return null
  }
}

export async function bootstrapAdminUser() {
  const sql = getDb()
  const existing = await sql`SELECT COUNT(*)::int AS count FROM admin_users`
  if ((existing[0]?.count || 0) > 0) return null

  const password = process.env.ADMIN_PASSWORD
  if (!password) return null

  const email = (process.env.ADMIN_EMAIL || 'office@anjalsolutionsltd.com').toLowerCase()
  const name = process.env.ADMIN_NAME || 'Anjal Solutions Management'
  const passwordHash = await bcrypt.hash(password, 12)

  const result = await sql`
    INSERT INTO admin_users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${passwordHash}, 'owner')
    RETURNING id, name, email, role, is_active
  `
  return result[0]
}

export async function verifyAdminCredentials(email, password) {
  if (!password) return null
  const sql = getDb()
  let users = []

  if (email) {
    users = await sql`
      SELECT id, name, email, password_hash, role, is_active
      FROM admin_users
      WHERE lower(email) = lower(${email})
      LIMIT 1
    `
  } else {
    users = await sql`
      SELECT id, name, email, password_hash, role, is_active
      FROM admin_users
      WHERE is_active = true
      ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, id ASC
      LIMIT 1
    `
  }

  const user = users[0]
  if (!user || !user.is_active) return null
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return null

  await sql`UPDATE admin_users SET last_login_at = NOW(), updated_at = NOW() WHERE id = ${user.id}`
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function getAdminFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').filter(Boolean).map(c => {
      const [k, ...v] = c.trim().split('=')
      return [k, v.join('=')]
    })
  )
  const token = cookies.admin_token
  if (!token) return null
  return verifyToken(token)
}

export function setAdminCookie(response, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.headers.set(
    'Set-Cookie',
    `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24}${secure}`
  )
  return response
}

export function clearAdminCookie(response) {
  response.headers.set(
    'Set-Cookie',
    'admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
  )
  return response
}
