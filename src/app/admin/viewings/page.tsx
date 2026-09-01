import { prisma } from '@/lib/prisma';
import { listLabelMaps } from '@/lib/constants';
import { formatDate, formatDateTime } from '@/lib/format';
import StatusSelect from '@/components/admin/StatusSelect';
import ViewingSchedule from '@/components/admin/ViewingSchedule';
import { updateViewingStatus } from '@/actions/admin/viewings';

export const dynamic = 'force-dynamic';

export default async function AdminViewingsPage() {
  const viewings = await prisma.viewing.findMany({
    orderBy: { requestedAt: 'desc' },
    include: { property: true, lead: true, agent: true },
  });
  const agents = await prisma.user.findMany({
    where: { isActive: true, role: { in: ['AGENT', 'MANAGER'] } },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Viewings</h2>
        <p className="text-sm text-stone-500">{viewings.length} total</p>
      </div>

      <div className="space-y-4">
        {viewings.length === 0 && (
          <div className="rounded-card border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
            No viewing requests yet.
          </div>
        )}
        {viewings.map((v) => (
          <div key={v.id} className="rounded-card border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{v.property?.title ?? 'Property request'}</p>
                <p className="text-sm text-stone-600">
                  {v.lead?.name ?? 'No lead'}
                  {v.lead?.phone ? ` · ${v.lead.phone}` : ''}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Requested {formatDateTime(v.requestedAt)}
                  {v.scheduledAt ? ` · Scheduled ${formatDateTime(v.scheduledAt)}` : ''}
                  {v.agent ? ` · ${v.agent.name}` : ''}
                </p>
                {v.notes && <p className="mt-2 text-sm text-stone-600">{v.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusSelect
                  value={v.status}
                  options={listLabelMaps.viewingStatus}
                  onChange={(status) => updateViewingStatus(v.id, status)}
                />
              </div>
            </div>
            {v.status === 'REQUESTED' && (
              <div className="mt-4 border-t border-stone-100 pt-4">
                <ViewingSchedule viewingId={v.id} agents={agents} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
