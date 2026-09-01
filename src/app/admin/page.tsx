import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { labelOf } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const [
    totalProperties,
    saleProperties,
    rentalProperties,
    soldProperties,
    rentedProperties,
    newLeads,
    totalLeads,
    pendingViewings,
    applications,
    pendingSubmissions,
    latestLeads,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { listingPurpose: { in: ['SALE', 'BOTH'] } } }),
    prisma.property.count({ where: { listingPurpose: { in: ['RENT', 'BOTH'] } } }),
    prisma.property.count({ where: { propertyStatus: 'SOLD' } }),
    prisma.property.count({ where: { propertyStatus: 'RENTED' } }),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count(),
    prisma.viewing.count({ where: { status: { in: ['REQUESTED', 'SCHEDULED', 'CONFIRMED'] } } }),
    prisma.rentalApplication.count({ where: { status: { in: ['NEW', 'UNDER_REVIEW', 'VIEWING_SCHEDULED', 'DOCUMENTS_REQUESTED'] } } }),
    prisma.ownerSubmission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { property: true, assignedTo: true } }),
  ]);

  const stats = [
    { label: 'Total properties', value: totalProperties, href: '/admin/properties' },
    { label: 'For sale', value: saleProperties, href: '/admin/properties' },
    { label: 'For rent', value: rentalProperties, href: '/admin/properties' },
    { label: 'Sold', value: soldProperties, href: '/admin/properties' },
    { label: 'Rented', value: rentedProperties, href: '/admin/properties' },
    { label: 'New leads', value: newLeads, href: '/admin/leads', highlight: true },
    { label: 'Pending viewings', value: pendingViewings, href: '/admin/viewings', highlight: true },
    { label: 'Active applications', value: applications, href: '/admin/applications', highlight: true },
    { label: 'Pending owner submissions', value: pendingSubmissions, href: '/admin/submissions', highlight: true },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-stone-500">A snapshot of your property and lead activity.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">Add Property</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-card border bg-white p-5 shadow-sm transition-shadow hover:shadow-card ${
              s.highlight ? 'border-brand-200' : 'border-stone-200'
            }`}
          >
            <p className="text-3xl font-bold text-stone-900">{s.value}</p>
            <p className={`mt-1 text-sm ${s.highlight ? 'text-brand-700' : 'text-stone-500'}`}>{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold">Recent leads</h3>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>
        </div>
        {latestLeads.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-500">No leads yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {latestLeads.map((lead) => (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-stone-50">
                <div>
                  <p className="font-medium text-stone-900">{lead.name}</p>
                  <p className="text-xs text-stone-500">
                    {lead.property?.title ?? lead.preferredLocation ?? 'Property request'} · {formatDate(lead.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge bg-stone-100 text-stone-700">{labelOf('leadStatus', lead.status)}</span>
                  <span className="text-xs text-stone-400">{lead.assignedTo?.name ?? 'Unassigned'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
