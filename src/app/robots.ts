import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/hero-prototype/', '/booking-success'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/hero-prototype/', '/booking-success'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/hero-prototype/', '/booking-success'],
      },
    ],
    sitemap: 'https://litworks.agency/sitemap.xml',
    host: 'https://litworks.agency',
  };
}
