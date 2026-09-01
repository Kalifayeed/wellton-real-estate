import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon, GlobeIcon, CheckIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Diaspora Buyers & International Investors',
  description:
    'Buy, rent and manage property in Nairobi from abroad. Virtual viewings, remote communication, developer information, payment plans and investment guidance for Kenyans living overseas.',
};

const services = [
  'Property searches & comparisons',
  'Virtual viewings on request',
  'Developer information',
  'Payment plans & investment guidance',
  'Rental searches before relocation',
  'Tenant sourcing & property management',
  'Physical viewings when you visit',
  'Remote communication & follow-up',
];

export default function DiasporaPage() {
  return (
    <>
      <PageHero
        kicker="Kenyans Abroad & International Investors"
        title="Buying Property in Kenya from Abroad"
        description="We help the diaspora search, compare, view and secure property in Nairobi — remotely and safely."
        tone="brand"
      />

      <section className="section">
        <div className="page-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Your trusted partner back home</h2>
              <p className="mt-3 max-w-xl text-stone-600">
                Buying or managing property from abroad can be complex. Wellton acts as your trusted
                on-the-ground partner, keeping you informed and connected at every step.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 rounded-card border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800">
                    <CheckIcon className="h-4 w-4 shrink-0 text-brand-600" /> {s}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Link href="/buy" className="btn-primary justify-center">
                  Buy a Property
                </Link>
                <Link href="/rent" className="btn-primary justify-center bg-gold-600 hover:bg-gold-700">
                  Find a Rental
                </Link>
                <Link href="/property-management" className="btn-secondary justify-center">
                  Manage My Property
                </Link>
                <a href={buildWhatsAppLink('Hello Wellton, I am based abroad and would like to request a virtual viewing.')} target="_blank" rel="noreferrer" className="btn-whatsapp justify-center">
                  <WhatsAppIcon className="h-4 w-4" /> Request Virtual Viewing
                </a>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-card bg-brand-950 p-6 text-white">
                <GlobeIcon className="h-8 w-8 text-brand-300" />
                <h3 className="mt-4 font-serif text-xl font-semibold text-white">We work across time zones</h3>
                <p className="mt-2 text-sm text-brand-100">
                  Our team communicates by WhatsApp, phone and email to keep you informed — wherever you
                  are in the world.
                </p>
              </div>
              <div className="rounded-card border border-stone-200 bg-white p-6 text-sm text-stone-600">
                <p className="font-semibold text-stone-900">Important</p>
                <p className="mt-2">
                  We would love to help you. Share your requirements and we&apos;ll organise virtual
                  viewings and remote property tours for you.
                </p>
              </div>
              <a href={buildWhatsAppLink(genericMessage('diaspora'))} target="_blank" rel="noreferrer" className="btn-whatsapp w-full">
                <WhatsAppIcon className="h-4 w-4" /> Chat with the diaspora team
              </a>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
