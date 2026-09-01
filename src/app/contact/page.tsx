import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import ContactForm from '@/components/forms/ContactForm';
import MapEmbed from '@/components/property/MapEmbed';
import { buildTelLink, buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { PhoneIcon, MailIcon, LocationIcon, WhatsAppIcon, ClockIcon } from '@/components/shared/Icons';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact Wellton Real Estate',
  description:
    'Contact Wellton Real Estate in Nairobi to buy, sell, rent or manage property. Phone, WhatsApp, email and office location.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Get in Touch"
        title="Contact Us"
        description="We'd love to help. Reach us by phone, WhatsApp, email or the form below."
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Send us a message</h2>
              <div className="mt-4">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700"><PhoneIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">Phone</p>
                    <a href={buildTelLink()} className="font-medium text-stone-900 hover:text-brand-700">{siteConfig.phoneDisplay}</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]"><WhatsAppIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">WhatsApp</p>
                    <a href={buildWhatsAppLink(genericMessage())} target="_blank" rel="noreferrer" className="font-medium text-stone-900 hover:text-brand-700">Chat with us</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700"><MailIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="font-medium text-stone-900 hover:text-brand-700">{siteConfig.email}</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700"><LocationIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">Office</p>
                    <p className="font-medium text-stone-900">{siteConfig.address}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700"><ClockIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">Hours</p>
                    <p className="font-medium text-stone-900">{siteConfig.officeHours}</p>
                    <p className="text-stone-500">{siteConfig.viewingHours}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-card border border-stone-200">
              <MapEmbed address="Nairobi, Kenya" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
