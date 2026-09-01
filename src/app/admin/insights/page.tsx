import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/format';
import BlogRowActions from '@/components/admin/BlogRowActions';

export const dynamic = 'force-dynamic';

export default async function AdminInsightsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Property Insights</h2>
          <p className="text-sm text-stone-500">{posts.length} posts</p>
        </div>
        <Link href="/admin/insights/new" className="btn-primary">New Post</Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Post</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                <td className="px-4 py-3 text-stone-600">{p.category?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-500">{formatDate(p.updatedAt)}</td>
                <td className="px-4 py-3"><BlogRowActions id={p.id} isPublished={p.isPublished} /></td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-stone-500">No posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
