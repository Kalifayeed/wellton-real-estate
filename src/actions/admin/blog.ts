'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { slugify } from '@/lib/format';
import { logAudit } from '@/lib/audit';
import { fail, ok, type ActionState } from '../shared';

export async function createPost(_: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  const title = String(formData.get('title') || '');
  if (!title) return fail('Title is required.');
  const content = String(formData.get('content') || '');

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: slugify(String(formData.get('slug') || title)),
        content,
        excerpt: String(formData.get('excerpt') || '') || undefined,
        categoryId: String(formData.get('categoryId') || '') || undefined,
        featuredImage: String(formData.get('featuredImage') || '') || undefined,
        seoTitle: String(formData.get('seoTitle') || '') || undefined,
        seoDescription: String(formData.get('seoDescription') || '') || undefined,
        isPublished: formData.get('isPublished') === 'on',
        publishedAt: formData.get('isPublished') === 'on' ? new Date() : undefined,
        authorId: session.sub,
      },
    });
    await logAudit({ userId: session.sub, action: 'OTHER', entity: 'BlogPost', entityId: post.id, metadata: { op: 'created' } });
    revalidatePath('/admin/insights');
    return ok('Post created.', { entityId: post.id });
  } catch (e) {
    console.error('[createPost]', e);
    return fail('Could not create post.');
  }
}

export async function updatePost(_: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  const id = String(formData.get('id') || '');
  if (!id) return fail('Missing post id.');
  const title = String(formData.get('title') || '');
  if (!title) return fail('Title is required.');

  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: slugify(String(formData.get('slug') || title)),
        content: String(formData.get('content') || ''),
        excerpt: String(formData.get('excerpt') || '') || undefined,
        categoryId: String(formData.get('categoryId') || '') || undefined,
        featuredImage: String(formData.get('featuredImage') || '') || undefined,
        seoTitle: String(formData.get('seoTitle') || '') || undefined,
        seoDescription: String(formData.get('seoDescription') || '') || undefined,
        isPublished: formData.get('isPublished') === 'on',
        publishedAt: formData.get('isPublished') === 'on' ? new Date() : undefined,
      },
    });
    await logAudit({ userId: session.sub, action: 'OTHER', entity: 'BlogPost', entityId: id, metadata: { op: 'updated' } });
    revalidatePath('/admin/insights');
    return ok('Post updated.');
  } catch (e) {
    console.error('[updatePost]', e);
    return fail('Could not update post.');
  }
}

export async function togglePublishPost(id: string): Promise<void> {
  await requireRoles(['ADMIN', 'MANAGER']);
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { isPublished: true } });
  if (!post) return;
  await prisma.blogPost.update({
    where: { id },
    data: { isPublished: !post.isPublished, publishedAt: !post.isPublished ? new Date() : undefined },
  });
  revalidatePath('/admin/insights');
}

export async function deletePost(id: string): Promise<void> {
  await requireRoles(['ADMIN']);
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/insights');
}
