import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/data/blog-queries';
import { formatDate } from '@/lib/format';
import PageHero from '@/components/shared/PageHero';
import { ArrowRightIcon } from '@/components/shared/Icons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Insights',
  description:
    'Guides and advice on buying, renting and investing in Nairobi real estate — market updates, area guides and property management tips.',
};

export default async function InsightsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        kicker="Guides & Market Updates"
        title="Property Insights"
        description="Expert advice on buying, renting and investing in Nairobi — from area guides to market updates and tenant tips."
      />

      <section className="section">
        <div className="page-container">
          {posts.length === 0 ? (
            <div className="rounded-card border border-stone-200 bg-white px-6 py-16 text-center">
              <h3 className="font-serif text-xl font-semibold text-stone-900">Insights coming soon</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
                Our team is preparing helpful guides on buying, renting and investing in Nairobi. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/property-insights/${post.slug}`}
                  className="group overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/9] bg-stone-200">
                    {post.featuredImage ? (
                      <Image src={post.featuredImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-400">Wellton</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-3 text-xs text-stone-500">
                      {post.category && <span className="badge bg-brand-50 text-brand-800">{post.category.name}</span>}
                      {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                    </div>
                    <h2 className="font-serif text-xl font-semibold text-stone-900">{post.title}</h2>
                    {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-stone-600">{post.excerpt}</p>}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                      Read more <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
