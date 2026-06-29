import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://elbanoindia.com'

  // Main route pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/projects',
    '/services',
    '/testimonials',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
