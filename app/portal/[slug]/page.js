import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Client Portal — Anjal Ventures',
  robots: 'noindex, nofollow',
}

export default async function PortalEntry({ params }) {
  const slug = (params?.slug || '').toLowerCase()

  // Fetch the client's current portal_stage from the API
  let portalStage = 'review'
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/portal/${slug}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      portalStage = data?.client?.portal_stage || 'review'
    }
  } catch (_) {
    // Fall through to review on error
  }

  if (portalStage === 'progress') {
    redirect(`/portal/${slug}/progress`)
  } else {
    redirect(`/portal/${slug}/review`)
  }
}
