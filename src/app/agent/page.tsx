import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { labelOf } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AgentOverview() {
  const session = await getSession();
  if (!session) redirect('/login');
  const isAgent = session.role === 'AGENT';

  const where = isAgent ? { assignedToId: session.sub } : {};
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });

  const today = new Date();
  const followUpsDue = await prisma.leadActivity.count({
    where: { followUpDate: { lte: today }, leadId: isAgent ? session.sub : undefined },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">{isAgent ? 'My Leads' : 'All Leads'}</h2>
        <p className="text-sm text-stone-500">Welcome back, {session.name}.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned leads" value={leads.length} />
        <StatCard label="Follow-ups due" value={followUpsDue} />
        <StatCard label="Active" value={leads.filter((l) => ['NEW', 'CONTACTED', 'INTERESTED', 'VIEWING_SCHEDULED'].includes(l.status)).length} />
      </div>

      <div className="overflow-x-auto rounded-card border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Property / Request</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link href={isAgent ? `/agent` : `/admin/leads/${lead.id}`} className="font-medium text-stone-900 hover:text-brand-700">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-stone-500">{lead.phone}</p>
                </td>
                <td className="px-4 py-3 text-stone-700">{lead.property?.title ?? lead.preferredLocation ?? '—'}</td>
                <td className="px-4 py-3"><span className="badge bg-stone-100 text-stone-700">{labelOf('leadStatus', lead.status)}</span></td>
                <td className="px-4 py-3 text-stone-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-stone-500">No leads assigned to you yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-stone-200 bg-white p-5">
      <p className="text-3xl font-bold text-stone-900">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  );
}
