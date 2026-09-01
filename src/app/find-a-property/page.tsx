import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import FindPropertyForm from '@/components/forms/FindPropertyForm';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Find Me a Property in Nairobi',
  description:
    'Tell Wellton what you are looking for and we will match you with suitable homes, rental opportunities and investment properties in Nairobi.',
};

export default function FindPropertyPage() {
  return (
    <>
      <PageHero
        kicker="Buying, Renting or Investing"
        title="Find Me a Property"
        description="Tell us what you're looking for and our team will match you with suitable properties in Nairobi."
        tone="brand"
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Tell us your requirements</h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Share your preferences below. We&apos;ll review your requirements, match you with
              available properties and get in touch to arrange viewings or a call.
            </p>
            <div className="mt-8">
              <FindPropertyForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Why use our search service?</h3>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                <li>Personalised matching based on your needs</li>
                <li>Access to off-market and exclusive listings</li>
                <li>Guidance on price, areas and investment potential</li>
                <li>Support for buyers, renters and investors</li>
              </ul>
            </div>
            <div className="rounded-card bg-[#25D366] p-6 text-white">
              <h3 className="font-serif text-lg font-semibold">Prefer WhatsApp?</h3>
              <p className="mt-2 text-sm text-white/90">
                Chat directly with our team, or call us on {siteConfig.phoneDisplay}.
              </p>
              <div className="mt-4 grid gap-2.5">
                <a href={buildWhatsAppLink(genericMessage('find-property'))} target="_blank" rel="noreferrer" className="btn bg-white text-[#1fb457] hover:bg-stone-50">
                  <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
