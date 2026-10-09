import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/config';

// Query published listings at request time, including after a DB-free build.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes = [
    '',
    '/buy',
    '/rent',
    '/properties',
    '/find-a-property',
    '/find-a-rental',
    '/sell-your-property',
    '/property-management',
    '/diaspora-buyers',
    '/property-insights',
    '/about',
    '/contact',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // DB-backed routes are best-effort so the build never fails when the
  // database is unavailable (e.g. during a container image build).
  let properties: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    [properties, posts] = await Promise.all([
      prisma.property.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // fall through with static routes only
  }

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/property-insights/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...postRoutes];
}
