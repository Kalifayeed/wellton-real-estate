import { prisma } from '@/lib/prisma';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 font-serif text-2xl font-semibold">New Post</h2>
      <BlogForm categories={categories} />
    </div>
  );
}
