import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import FindRentalForm from '@/components/forms/FindRentalForm';
import { buildWhatsAppLink, buildTelLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon, PhoneIcon, CheckIcon } from '@/components/shared/Icons';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Find a Rental in Nairobi',
  description:
    'Apartments, houses, townhouses, furnished and serviced apartments, short- and long-term rentals and commercial spaces in Nairobi.',
};

const rentalTypes = [
  'Apartments',
  'Houses',
  'Townhouses',
  'Furnished apartments',
  'Unfurnished apartments',
  'Serviced apartments',
  'Short-term rentals',
  'Long-term rentals',
  'Commercial rental spaces',
];

export default function FindRentalPage() {
  return (
    <>
      <PageHero
        kicker="Renting in Nairobi"
        title="Find a Rental"
        description="From long-term family homes to furnished city apartments, we help you find and secure the right rental."
        tone="gold"
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_440px]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">What we help you find</h2>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rentalTypes.map((t) => (
                <li key={t} className="flex items-center gap-2.5 rounded-card border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800">
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-600" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">How it works</h3>
              <ol className="mt-4 space-y-3 text-sm text-stone-600">
                <li><span className="font-semibold text-stone-900">1.</span> Share your rental requirements.</li>
                <li><span className="font-semibold text-stone-900">2.</span> We source matching rentals and arrange viewings.</li>
                <li><span className="font-semibold text-stone-900">3.</span> Apply, get approved and move in.</li>
              </ol>
              <p className="mt-4 text-sm text-stone-600">
                Most of our rentals are available to apply online. <Link href="/rent" className="link font-semibold">Browse current rentals</Link>.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Start your rental search</h3>
              <div className="mt-4">
                <FindRentalForm />
              </div>
            </div>
            <div className="grid gap-2.5">
              <a href={buildWhatsAppLink(genericMessage('find-rental'))} target="_blank" rel="noreferrer" className="btn-whatsapp w-full">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
              </a>
              <a href={buildTelLink()} className="btn-secondary w-full">
                <PhoneIcon className="h-4 w-4" /> Call {siteConfig.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
