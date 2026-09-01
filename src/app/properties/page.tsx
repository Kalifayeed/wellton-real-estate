import { Suspense } from 'react';
import type { Metadata } from 'next';
import { queryProperties } from '@/lib/data/queries';
import { parseFilters } from '@/lib/data/parse-filters';
import PropertyBrowser from '@/components/property/PropertyBrowser';
import PropertyGrid from '@/components/property/PropertyGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Listings in Nairobi',
  description:
    'Browse apartments, houses, townhouses, off-plan developments and commercial property for sale and rent in Nairobi, Kenya.',
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { items, total } = await queryProperties(filters);

  return (
    <>
      <section className="border-b border-stone-200 bg-stone-100 py-10">
        <div className="page-container">
          <p className="heading-kicker">Nairobi Property Listings</p>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Properties for Sale &amp; Rent</h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Explore Wellton&apos;s portfolio of residential and commercial properties across Nairobi&apos;s
            most sought-after locations.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="page-container">
          <Suspense fallback={<div className="h-[400px]" />}>
            <PropertyBrowser basePath="/properties" purposeScope="BOTH" total={total}>
              <PropertyGrid
                properties={items}
                clearFilters={[
                  { href: '/buy', label: 'Browse for sale' },
                  { href: '/rent', label: 'Browse rentals' },
                ]}
              />
            </PropertyBrowser>
          </Suspense>
        </div>
      </section>
    </>
  );
}
