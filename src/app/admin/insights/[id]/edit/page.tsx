import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Edit Post</h2>
      <BlogForm post={post} categories={categories} />
    </div>
  );
}
