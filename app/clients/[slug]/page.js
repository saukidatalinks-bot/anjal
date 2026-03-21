import ClientPortalDashboard from '@/components/ClientPortalDashboard'

export const metadata = {
  title: 'Client Portal - Anjal Ventures',
  robots: 'noindex, nofollow',
}

export default function ClientPortalPage({ params }) {
  const slug = (params?.slug || '').toLowerCase()
  return <ClientPortalDashboard slug={slug} />
}
