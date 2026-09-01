import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { labelOf } from '@/lib/constants';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import LeadActions from '@/components/admin/LeadActions';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      property: true,
      assignedTo: true,
      activities: { orderBy: { createdAt: 'desc' } },
      viewings: { include: { property: true } },
      applications: true,
    },
  });
  if (!lead) notFound();

  const agents = await prisma.user.findMany({
    where: { isActive: true, role: { in: ['AGENT', 'MANAGER'] } },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">{lead.name}</h2>
        <p className="text-sm text-stone-500">
          {lead.phone}
          {lead.email ? ` · ${lead.email}` : ''} · Received {formatDate(lead.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Lead details */}
          <div className="rounded-card border border-stone-200 bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">Lead details</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail k="Property" v={lead.property?.title ?? lead.preferredLocation ?? '—'} />
              <Detail k="Listing purpose" v={lead.listingPurpose ? labelOf('listingPurpose', lead.listingPurpose) : '—'} />
              <Detail k="Budget" v={lead.budget ? formatCurrency(lead.budget.toNumber()) : '—'} />
              <Detail k="Budget frequency" v={lead.budgetFrequency ? labelOf('rentalFrequency', lead.budgetFrequency) : '—'} />
              <Detail k="Preferred move-in" v={lead.preferredMoveIn ? formatDate(lead.preferredMoveIn) : '—'} />
              <Detail k="Source" v={labelOf('leadSource', lead.source)} />
              <Detail k="Status" v={labelOf('leadStatus', lead.status)} />
              <Detail k="Assigned agent" v={lead.assignedTo?.name ?? 'Unassigned'} />
            </dl>
            {lead.notes && (
              <div className="mt-4 rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
                <p className="mb-1 text-xs font-semibold uppercase text-stone-500">Notes</p>
                {lead.notes}
              </div>
            )}
          </div>

          {/* Viewings */}
          {lead.viewings.length > 0 && (
            <div className="rounded-card border border-stone-200 bg-white p-6">
              <h3 className="mb-4 font-serif text-lg font-semibold">Viewings</h3>
              <ul className="space-y-3">
                {lead.viewings.map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-sm">
                    <span>{v.property?.title}</span>
                    <span className="badge bg-stone-100 text-stone-700">{labelOf('viewingStatus', v.status)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Activity timeline */}
          <div className="rounded-card border border-stone-200 bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">Activity</h3>
            {lead.activities.length === 0 ? (
              <p className="text-sm text-stone-500">No activity yet.</p>
            ) : (
              <ol className="relative space-y-5 border-l border-stone-200 pl-5">
                {lead.activities.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-600" />
                    <p className="text-sm text-stone-800">{a.note}</p>
                    <p className="text-xs text-stone-500">
                      {formatDateTime(a.createdAt)}
                      {a.followUpDate ? ` · follow-up ${formatDate(a.followUpDate)}` : ''}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Actions */}
        <aside>
          <div className="rounded-card border border-stone-200 bg-white p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">Manage lead</h3>
            <LeadActions leadId={lead.id} agents={agents} currentAgentId={lead.assignedToId} currentStatus={lead.status} />
          </div>
        </aside>
      </div>
    </>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{k}</dt>
      <dd className="mt-0.5 text-sm text-stone-800">{v}</dd>
    </div>
  );
}
