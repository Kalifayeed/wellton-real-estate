import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { listLabelMaps } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import StatusSelect from '@/components/admin/StatusSelect';
import { updateApplicationStatus } from '@/actions/admin/applications';

export const dynamic = 'force-dynamic';

export default async function AgentApplicationsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const applications = await prisma.rentalApplication.findMany({
    where: session.role === 'AGENT' ? { assignedToId: session.sub } : {},
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Rental Applications</h2>
        <p className="text-sm text-stone-500">{applications.length} total</p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 && (
          <div className="rounded-card border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">No applications.</div>
        )}
        {applications.map((app) => (
          <div key={app.id} className="rounded-card border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{app.applicantName}</p>
                <p className="text-sm text-stone-600">{app.property?.title} · Applied {formatDate(app.createdAt)}</p>
              </div>
              <StatusSelect value={app.status} options={listLabelMaps.applicationStatus} onChange={(status) => updateApplicationStatus(app.id, status)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
