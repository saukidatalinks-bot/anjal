import { getDb, initDb } from '@/lib/db'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anjalsolutionsltd.com'
  const lastModified = new Date()

  try {
    await initDb()
    const sql = getDb()

    // Get all dynamic content
    const projects = await sql`SELECT id, slug FROM projects WHERE is_active = true`

    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'weekly' },
      { url: '/services', priority: 0.9, changefreq: 'weekly' },
      { url: '/work', priority: 0.9, changefreq: 'weekly' },
      { url: '/work/apps', priority: 0.8, changefreq: 'weekly' },
      { url: '/work/websites', priority: 0.8, changefreq: 'weekly' },
      { url: '/app-studio', priority: 0.9, changefreq: 'weekly' },
      { url: '/quote', priority: 0.9, changefreq: 'weekly' },
      { url: '/about', priority: 0.7, changefreq: 'monthly' },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    ]

    const projectPages = projects.map((p) => ({
      url: `/work/${p.slug || p.id}`,
      priority: 0.7,
      changefreq: 'monthly',
    }))

    return [
      ...staticPages,
      ...projectPages,
    ].map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified,
      changeFrequency: page.changefreq,
      priority: page.priority,
    }))
  } catch (error) {
    console.error('Sitemap generation error:', error)
    // Return basic sitemap on error
    return [
      {
        url: baseUrl,
        lastModified,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ]
  }
}
