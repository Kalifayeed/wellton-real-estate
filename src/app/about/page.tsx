import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon, CheckIcon } from '@/components/shared/Icons';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About Wellton Real Estate',
  description:
    'Wellton Real Estate helps clients buy, sell, rent and manage properties through professional guidance, market knowledge and personalised service in Nairobi and beyond.',
};

const why = [
  'Professional guidance at every stage',
  'In-depth knowledge of Nairobi’s property market',
  'Personalised, one-to-one service',
  'A curated portfolio of quality properties',
  'Rental assistance and tenant support',
  'Dedicated diaspora support',
  'Full property management for landlords',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Us"
        title="A Modern Property Partner in Nairobi"
        description="Wellton Real Estate helps clients buy, sell, rent and manage properties through professional guidance, market knowledge and personalised service."
        tone="brand"
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Who we are</h2>
            <p className="mt-4 text-stone-600">
              Wellton Real Estate connects clients with suitable homes, rental opportunities and
              property investments in Nairobi and beyond. We combine local market knowledge with a
              modern, digital-first approach to buying, selling, renting and managing property.
            </p>
            <p className="mt-4 text-stone-600">
              Whether you are a first-time buyer, a growing family, an investor, a landlord or a
              member of the diaspora, our team works with you to understand your goals and deliver
              the right outcome.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold">Why clients choose Wellton</h2>
            <ul className="mt-4 space-y-3">
              {why.map((w) => (
                <li key={w} className="flex items-center gap-2.5 text-stone-700">
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-600" /> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-brand-950 text-white">
        <div className="page-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="heading-kicker !text-brand-300">Mission</p>
            <p className="mt-3 font-serif text-2xl font-semibold text-white">
              To help people find, buy, sell, rent and manage property with confidence and ease.
            </p>
          </div>
          <div>
            <p className="heading-kicker !text-brand-300">Vision</p>
            <p className="mt-3 font-serif text-2xl font-semibold text-white">
              To be Nairobi&apos;s most trusted, client-first real-estate partner.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Sales</h3>
              <p className="mt-2 text-sm text-stone-600">Buying and selling residential and commercial property in Nairobi&apos;s best areas.</p>
            </div>
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Rentals</h3>
              <p className="mt-2 text-sm text-stone-600">Long-term and short-term rentals, from furnished apartments to family homes.</p>
            </div>
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Management</h3>
              <p className="mt-2 text-sm text-stone-600">End-to-end property management for landlords and investors.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-card bg-stone-900 px-7 py-6 text-white sm:flex-row">
            <div>
              <h3 className="font-serif text-xl font-semibold">Ready to work with us?</h3>
              <p className="text-sm text-stone-300">Contact Wellton on {siteConfig.phoneDisplay} or browse our current listings.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Contact Us</Link>
              <a href={buildWhatsAppLink(genericMessage())} target="_blank" rel="noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
