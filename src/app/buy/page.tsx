import { Suspense } from 'react';
import type { Metadata } from 'next';
import { queryProperties } from '@/lib/data/queries';
import { parseFilters } from '@/lib/data/parse-filters';
import PropertyBrowser from '@/components/property/PropertyBrowser';
import PropertyGrid from '@/components/property/PropertyGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buy Property in Nairobi',
  description:
    'Apartments, houses, townhouses and investment properties for sale in Kilimani, Karen, Westlands, Runda and across Nairobi.',
};

export default async function BuyPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const filters = { ...parseFilters(sp), listingPurpose: 'SALE' as const };
  const { items, total } = await queryProperties(filters);

  return (
    <>
      <section className="border-b border-stone-200 bg-brand-950 py-12 text-white">
        <div className="page-container">
          <p className="heading-kicker !text-brand-300">For Sale</p>
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Buy Property in Nairobi</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            Discover apartments, houses, townhouses, villas and investment opportunities in Nairobi&apos;s
            most desirable neighbourhoods.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="page-container">
          <Suspense fallback={<div className="h-[400px]" />}>
            <PropertyBrowser basePath="/buy" purposeScope="SALE" total={total}>
              <PropertyGrid
                properties={items}
                clearFilters={[
                  { href: '/buy', label: 'Clear filters' },
                  { href: '/find-a-property', label: 'Request a custom search' },
                ]}
              />
            </PropertyBrowser>
          </Suspense>
        </div>
      </section>
    </>
  );
}
