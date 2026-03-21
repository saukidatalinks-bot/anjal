import { redirect } from 'next/navigation'

// Permanent redirect to new portal routing
export default function ClientPortalPage({ params }) {
  const slug = (params?.slug || '').toLowerCase()
  redirect(`/portal/${slug}`)
}
