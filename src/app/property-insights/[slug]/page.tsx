import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getRecentPosts } from '@/lib/data/blog-queries';
import { formatDate } from '@/lib/format';
import { ArrowRightIcon } from '@/components/shared/Icons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    openGraph: post.featuredImage ? { title: post.title, images: [{ url: post.featuredImage }] } : undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const recent = await getRecentPosts(post.id);

  return (
    <div className="page-container py-12">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/property-insights" className="hover:text-brand-700">Property Insights</Link>
        <span className="mx-1.5">/</span>
        <span className="text-stone-700">{post.title}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-stone-500">
          {post.category && <span className="badge bg-brand-50 text-brand-800">{post.category.name}</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-stone-600">{post.excerpt}</p>}

        {post.featuredImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card">
            <Image src={post.featuredImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>
        )}

        <div className="prose-content mt-8">{post.content}</div>
      </article>

      {recent.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl border-t border-stone-200 pt-8">
          <h2 className="font-serif text-2xl font-semibold">More insights</h2>
          <ul className="mt-4 space-y-3">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/property-insights/${r.slug}`} className="group inline-flex items-center gap-2 font-medium text-stone-800 hover:text-brand-700">
                  {r.title} <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
