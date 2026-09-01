import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import SellPropertyForm from '@/components/forms/SellPropertyForm';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Sell Your Property in Nairobi',
  description:
    'List your apartment, house, townhouse or commercial property for sale or rent with Wellton. Professional valuation, marketing and onboarding.',
};

const steps = [
  { title: 'Submit your property', desc: 'Tell us about your property, its location and your expectations.' },
  { title: 'We review it', desc: 'Our team assesses your listing and contacts you to discuss the best approach.' },
  { title: 'Onboarding & listing', desc: 'We professionally market and publish your property to serious buyers and renters.' },
];

export default function SellPropertyPage() {
  return (
    <>
      <PageHero
        kicker="Property Owners & Landlords"
        title="Sell Your Property"
        description="Reach qualified buyers and tenants in Nairobi. Submit your property and let Wellton handle the rest."
        tone="stone"
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_440px]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">How it works</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-stone-900">{s.title}</h3>
                    <p className="text-sm text-stone-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-card border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg font-semibold">What we offer owners</h3>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 text-sm text-stone-700 sm:grid-cols-2">
                <li>Property valuation & pricing guidance</li>
                <li>Professional marketing & photography</li>
                <li>Qualified buyer & tenant sourcing</li>
                <li>Viewing management</li>
                <li>Negotiation support</li>
                <li>Full property management (optional)</li>
              </ul>
            </div>
          </div>

          <aside>
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Submit your property</h3>
              <p className="mt-2 text-sm text-stone-600">
                Every submission is reviewed by Wellton before it is published. We never auto-publish.
              </p>
              <div className="mt-4">
                <SellPropertyForm />
              </div>
            </div>
            <div className="mt-6 rounded-card bg-[#25D366] p-6 text-white">
              <h3 className="font-serif text-lg font-semibold">Quick question?</h3>
              <a href={buildWhatsAppLink(genericMessage('sell'))} target="_blank" rel="noreferrer" className="btn mt-4 w-full bg-white text-[#1fb457] hover:bg-stone-50">
                <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
