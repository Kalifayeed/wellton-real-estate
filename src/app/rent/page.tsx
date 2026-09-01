import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { queryProperties } from '@/lib/data/queries';
import { parseFilters } from '@/lib/data/parse-filters';
import PropertyBrowser from '@/components/property/PropertyBrowser';
import PropertyGrid from '@/components/property/PropertyGrid';
import { ArrowRightIcon } from '@/components/shared/Icons';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rent a Property in Nairobi',
  description:
    'Furnished and unfurnished apartments, houses, townhouses and commercial spaces to rent in Nairobi. Browse rentals and apply online.',
};

export default async function RentPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const filters = { ...parseFilters(sp), listingPurpose: 'RENT' as const };
  const { items, total } = await queryProperties(filters);

  return (
    <>
      <section className="border-b border-stone-200 bg-gold-600 py-12 text-white">
        <div className="page-container">
          <p className="heading-kicker !text-gold-100">For Rent</p>
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Rent a Property in Nairobi</h1>
          <p className="mt-3 max-w-2xl text-gold-50">
            Apartments, houses, townhouses, furnished rentals and commercial spaces — available across
            Nairobi. Apply online and schedule a viewing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/find-a-rental" className="btn-primary bg-white text-brand-800 hover:bg-stone-50">
              Find a Rental <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a href={buildWhatsAppLink(genericMessage('find-rental'))} target="_blank" rel="noreferrer" className="btn-outline-light">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="page-container">
          <Suspense fallback={<div className="h-[400px]" />}>
            <PropertyBrowser basePath="/rent" purposeScope="RENT" total={total}>
              <PropertyGrid
                properties={items}
                clearFilters={[
                  { href: '/rent', label: 'Clear filters' },
                  { href: '/find-a-rental', label: 'Request rental help' },
                ]}
              />
            </PropertyBrowser>
          </Suspense>
        </div>
      </section>
    </>
  );
}
