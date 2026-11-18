export function getJwtSecretBytes() {
  const envSecret = process.env.JWT_SECRET
  if (envSecret && envSecret.trim().length >= 32) {
    return new TextEncoder().encode(envSecret.trim())
  }
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable (minimum 32 characters) must be configured in production.')
  }
  return new TextEncoder().encode('anjal-local-dev-jwt-secret-minimum-32-bytes')
}
