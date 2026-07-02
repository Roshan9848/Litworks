import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://litworks.agency';
  const routes = ['', '/pricing', '/services', '/videos', '/contact'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '/contact' ? 'monthly' : 'weekly',
    priority: route === '' ? 1.0 : route === '/contact' ? 0.6 : 0.8,
  }));
}
