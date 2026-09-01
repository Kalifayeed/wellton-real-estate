import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { listLabelMaps } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import StatusSelect from '@/components/admin/StatusSelect';
import { updateViewingStatus } from '@/actions/admin/viewings';

export const dynamic = 'force-dynamic';

export default async function AgentViewingsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const viewings = await prisma.viewing.findMany({
    where: session.role === 'AGENT' ? { agentId: session.sub } : {},
    orderBy: { requestedAt: 'desc' },
    include: { property: true, lead: true },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">My Viewings</h2>
        <p className="text-sm text-stone-500">{viewings.length} total</p>
      </div>

      <div className="space-y-4">
        {viewings.length === 0 && (
          <div className="rounded-card border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">No viewings.</div>
        )}
        {viewings.map((v) => (
          <div key={v.id} className="rounded-card border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{v.property?.title ?? 'Property request'}</p>
                <p className="text-sm text-stone-600">{v.lead?.name ?? 'No lead'} · {formatDateTime(v.requestedAt)}</p>
                {v.scheduledAt && <p className="text-sm text-stone-600">Scheduled: {formatDateTime(v.scheduledAt)}</p>}
              </div>
              <StatusSelect value={v.status} options={listLabelMaps.viewingStatus} onChange={(status) => updateViewingStatus(v.id, status)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
