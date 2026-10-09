import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/agent', '/login', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
