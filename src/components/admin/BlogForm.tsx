'use client';

import { useActionState } from 'react';
import { createPost, updatePost } from '@/actions/admin/blog';
import { ErrorAlert, SuccessPanel } from '@/components/ui/form-fields';
import type { ActionState } from '@/actions/shared';
import type { BlogPost } from '@prisma/client';

const initialState: ActionState = { ok: false, message: '' };

export default function BlogForm({ post, categories }: { post?: BlogPost; categories: { id: string; name: string }[] }) {
  const action = post ? updatePost : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.ok) {
    return <SuccessPanel title="Saved" message={state.message} />;
  }

  return (
    <form action={formAction} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      <ErrorAlert message={state.message} />

      <section className="rounded-card border border-stone-200 bg-white p-6">
        <div className="grid gap-4">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input id="title" name="title" defaultValue={post?.title ?? ''} className="input" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className="label">Slug</label>
              <input id="slug" name="slug" defaultValue={post?.slug ?? ''} className="input" />
            </div>
            <div>
              <label htmlFor="categoryId" className="label">Category</label>
              <select id="categoryId" name="categoryId" className="input" defaultValue={post?.categoryId ?? ''}>
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="excerpt" className="label">Excerpt</label>
            <textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} rows={2} className="input" />
          </div>
          <div>
            <label htmlFor="content" className="label">Content (markdown)</label>
            <textarea id="content" name="content" defaultValue={post?.content ?? ''} rows={12} className="input font-mono" required />
          </div>
          <div>
            <label htmlFor="featuredImage" className="label">Featured image URL</label>
            <input id="featuredImage" name="featuredImage" defaultValue={post?.featuredImage ?? ''} className="input" placeholder="/uploads/… or https://…" />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">SEO</h2>
        <div className="grid gap-4">
          <div>
            <label htmlFor="seoTitle" className="label">SEO title</label>
            <input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="seoDescription" className="label">SEO description</label>
            <textarea id="seoDescription" name="seoDescription" defaultValue={post?.seoDescription ?? ''} rows={2} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished ?? true} className="h-4 w-4 rounded border-stone-300 text-brand-700 focus:ring-brand-600" />
            Publish (visible on the website)
          </label>
        </div>
      </section>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? 'Saving…' : post ? 'Save Changes' : 'Create Post'}
      </button>
    </form>
  );
}
