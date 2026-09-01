'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { togglePublishPost, deletePost } from '@/actions/admin/blog';

export default function BlogRowActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/insights/${id}/edit`} className="btn-secondary px-2.5 py-1.5 text-xs">Edit</Link>
      {isPublished && (
        <Link href={`/property-insights/${id}`} target="_blank" className="btn-secondary px-2.5 py-1.5 text-xs">View</Link>
      )}
      <button
        onClick={() => run(() => togglePublishPost(id))}
        disabled={pending}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border ${isPublished ? 'border-stone-300 text-stone-700' : 'border-brand-600 text-brand-700'}`}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={() => run(() => deletePost(id))}
        disabled={pending}
        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
