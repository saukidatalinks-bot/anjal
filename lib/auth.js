import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production-minimum-32chars'
)

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  // Support both plain text (dev) and bcrypt hash
  if (adminPassword.startsWith('$2')) {
    return bcrypt.compare(password, adminPassword)
  }
  // Direct comparison for plain text passwords in dev
  return password === adminPassword
}

export async function getAdminFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=')
      return [k, v.join('=')]
    })
  )
  const token = cookies['admin_token']
  if (!token) return null
  return verifyToken(token)
}

export function setAdminCookie(response, token) {
  response.headers.set(
    'Set-Cookie',
    `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24}`
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
