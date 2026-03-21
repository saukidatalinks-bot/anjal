import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Client Portal — Anjal Ventures',
  robots: 'noindex, nofollow',
}

export default async function PortalEntry({ params }) {
  const slug = (params?.slug || '').toLowerCase()

  let shouldOpenProgress = false
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/portal/${slug}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const stage1 = data?.stages?.stage1?.status
      const stage2 = data?.stages?.stage2?.status
      const stage3 = data?.stages?.stage3?.status
      shouldOpenProgress = ['pending', 'verified'].includes(stage1)
        || ['pending', 'verified', 'active'].includes(stage2)
        || ['active', 'complete'].includes(stage3)
    }
  } catch (_) {
    // Fall through to review on error
  }

  if (shouldOpenProgress) {
    redirect(`/portal/${slug}/progress`)
  } else {
    redirect(`/portal/${slug}/review`)
  }
}
