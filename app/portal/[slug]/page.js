import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Client Portal — Anjal Ventures',
  robots: 'noindex, nofollow',
}

export default async function PortalEntry({ params }) {
  const slug = (params?.slug || '').toLowerCase()
  redirect(`/portal/${slug}/review`)
}
