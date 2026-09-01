import { prisma } from '@/lib/prisma';
import { listLabelMaps } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import StatusSelect from '@/components/admin/StatusSelect';
import { updateApplicationStatus } from '@/actions/admin/applications';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const applications = await prisma.rentalApplication.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: true, assignedTo: true, documents: true },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Rental Applications</h2>
        <p className="text-sm text-stone-500">{applications.length} total</p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 && (
          <div className="rounded-card border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
            No rental applications yet.
          </div>
        )}
        {applications.map((app) => (
          <div key={app.id} className="rounded-card border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{app.applicantName}</p>
                <p className="text-sm text-stone-600">
                  {app.property?.title}
                  {app.assignedTo ? ` · ${app.assignedTo.name}` : ''}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {app.phone}
                  {app.email ? ` · ${app.email}` : ''} · Applied {formatDate(app.createdAt)}
                </p>
              </div>
              <StatusSelect
                value={app.status}
                options={listLabelMaps.applicationStatus}
                onChange={(status) => updateApplicationStatus(app.id, status)}
              />
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-stone-100 pt-4 text-sm sm:grid-cols-3">
              {app.preferredMoveIn && <Detail k="Move-in" v={formatDate(app.preferredMoveIn)} />}
              {app.leaseDuration && <Detail k="Lease duration" v={app.leaseDuration} />}
              {app.employmentStatus && <Detail k="Employment" v={app.employmentStatus} />}
              {app.incomeRange && <Detail k="Income" v={app.incomeRange} />}
              {app.employer && <Detail k="Employer" v={app.employer} />}
              {app.occupants != null && <Detail k="Occupants" v={String(app.occupants)} />}
            </dl>

            {app.references && <p className="mt-3 text-sm text-stone-600"><span className="font-medium">References:</span> {app.references}</p>}
            {app.additionalInfo && <p className="mt-1 text-sm text-stone-600"><span className="font-medium">Notes:</span> {app.additionalInfo}</p>}

            {app.documents.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {app.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/api/documents/${doc.id}`}
                    className="inline-flex items-center rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-brand-600 hover:text-brand-700"
                  >
                    {doc.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{k}</dt>
      <dd className="mt-0.5 text-stone-800">{v}</dd>
    </div>
  );
}
