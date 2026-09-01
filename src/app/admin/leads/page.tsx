import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { labelOf } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

const statusTone: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-stone-100 text-stone-700',
  INTERESTED: 'bg-brand-100 text-brand-700',
  VIEWING_SCHEDULED: 'bg-gold-100 text-gold-700',
  APPLICATION_SUBMITTED: 'bg-purple-100 text-purple-700',
  NEGOTIATING: 'bg-gold-100 text-gold-700',
  CLOSED_WON: 'bg-green-100 text-green-700',
  CLOSED_LOST: 'bg-red-100 text-red-700',
  NOT_QUALIFIED: 'bg-stone-100 text-stone-500',
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: true, assignedTo: true },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Leads</h2>
        <p className="text-sm text-stone-500">{leads.length} total leads</p>
      </div>

      <div className="overflow-x-auto rounded-card border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Property / Request</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-stone-900 hover:text-brand-700">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-stone-500">{lead.phone}</p>
                </td>
                <td className="px-4 py-3 text-stone-700">
                  {lead.property?.title ?? lead.preferredLocation ?? '—'}
                </td>
                <td className="px-4 py-3 text-stone-600">{lead.listingPurpose ? labelOf('listingPurpose', lead.listingPurpose) : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusTone[lead.status] ?? 'bg-stone-100 text-stone-700'}`}>
                    {labelOf('leadStatus', lead.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600">{lead.assignedTo?.name ?? <span className="text-stone-400">Unassigned</span>}</td>
                <td className="px-4 py-3 text-stone-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-stone-500">No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
