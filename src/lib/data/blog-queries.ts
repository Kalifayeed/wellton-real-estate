import { prisma } from '@/lib/prisma';

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    include: { category: true, author: true },
  });
}

export async function getRecentPosts(excludeId?: string, limit = 3) {
  return prisma.blogPost.findMany({
    where: { isPublished: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: { category: true },
  });
}
