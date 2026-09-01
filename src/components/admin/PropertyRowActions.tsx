'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { togglePublish, toggleFeatured, deleteProperty } from '@/actions/admin/properties';

export default function PropertyRowActions({ id, isPublished, isFeatured }: { id: string; isPublished: boolean; isFeatured: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/properties/${id}/edit`} className="btn-secondary px-2.5 py-1.5 text-xs">
        Edit
      </Link>
      <button
        onClick={() => run(() => togglePublish(id))}
        disabled={pending}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border ${isPublished ? 'border-stone-300 text-stone-700 hover:border-stone-500' : 'border-brand-600 text-brand-700 hover:bg-brand-50'}`}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={() => run(() => toggleFeatured(id))}
        disabled={pending}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border ${isFeatured ? 'border-gold-500 text-gold-600' : 'border-stone-300 text-stone-700'}`}
      >
        {isFeatured ? 'Unfeature' : 'Feature'}
      </button>
      <button
        onClick={() => run(() => deleteProperty(id))}
        disabled={pending}
        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
