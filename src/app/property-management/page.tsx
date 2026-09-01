import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import PropertyManagementForm from '@/components/forms/PropertyManagementForm';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon, CheckIcon } from '@/components/shared/Icons';

export const metadata: Metadata = {
  title: 'Property Management in Nairobi',
  description:
    'Full-service property management for landlords and investors in Nairobi — marketing, tenant sourcing, viewings, lease coordination, rent collection, inspections and maintenance.',
};

const services = [
  'Property marketing',
  'Tenant sourcing',
  'Rental pricing guidance',
  'Property viewings',
  'Tenant screening',
  'Lease coordination',
  'Rent collection',
  'Property inspections',
  'Maintenance coordination',
];

export default function PropertyManagementPage() {
  return (
    <>
      <PageHero
        kicker="For Landlords & Investors"
        title="Property Management"
        description="Own a property and want it looked after? We source tenants, manage viewings and leases, and keep your property in shape."
        tone="brand"
      />

      <section className="section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_440px]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Full-service property management</h2>
            <p className="mt-3 max-w-xl text-stone-600">
              From marketing your property to coordinating maintenance, Wellton manages the day-to-day
              so you can enjoy the returns without the workload.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s} className="flex items-center gap-2.5 rounded-card border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800">
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-600" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg font-semibold">Request property management</h3>
              <div className="mt-4">
                <PropertyManagementForm />
              </div>
            </div>
            <a href={buildWhatsAppLink(genericMessage('manage'))} target="_blank" rel="noreferrer" className="btn-whatsapp w-full">
              <WhatsAppIcon className="h-4 w-4" /> Talk to us on WhatsApp
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
