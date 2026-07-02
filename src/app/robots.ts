import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/hero-prototype/'],
    },
    sitemap: 'https://litworks.agency/sitemap.xml',
  };
}
