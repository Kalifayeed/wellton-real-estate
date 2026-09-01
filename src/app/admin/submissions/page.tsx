import { prisma } from '@/lib/prisma';
import { listLabelMaps } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/format';
import StatusSelect from '@/components/admin/StatusSelect';
import { updateSubmissionStatus } from '@/actions/admin/submissions';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.ownerSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { reviewedBy: true },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Owner Submissions</h2>
        <p className="text-sm text-stone-500">{submissions.length} total</p>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 && (
          <div className="rounded-card border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
            No owner submissions yet.
          </div>
        )}
        {submissions.map((s) => (
          <div key={s.id} className="rounded-card border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{s.ownerName}</p>
                <p className="text-sm text-stone-600">
                  {s.location || 'Location not specified'}
                  {s.propertyType ? ` · ${listLabelMaps.propertyType[s.propertyType as never] ?? s.propertyType}` : ''}
                  {s.bedrooms ? ` · ${s.bedrooms} bed` : ''}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {s.phone}
                  {s.email ? ` · ${s.email}` : ''} · Submitted {formatDate(s.createdAt)}
                </p>
                {s.reviewedBy && <p className="mt-1 text-xs text-stone-500">Reviewed by {s.reviewedBy.name}</p>}
              </div>
              <StatusSelect
                value={s.status}
                options={listLabelMaps.submissionStatus}
                onChange={(status) => updateSubmissionStatus(s.id, status)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-stone-100 pt-4 text-sm sm:grid-cols-3">
              <Detail k="Asking price" v={s.askingPrice ? formatCurrency(s.askingPrice.toNumber()) : '—'} />
              <Detail k="Rental price" v={s.rentalPrice ? formatCurrency(s.rentalPrice.toNumber()) : '—'} />
              <Detail k="Service" v={s.serviceType ? listLabelMaps.serviceType[s.serviceType as never] ?? s.serviceType : '—'} />
              <Detail k="Furnishing" v={s.furnishStatus ? listLabelMaps.furnishStatus[s.furnishStatus as never] ?? s.furnishStatus : '—'} />
              <Detail k="Availability" v={s.availability ?? '—'} />
              <Detail k="Contact method" v={s.contactMethod ?? '—'} />
            </div>

            {s.description && <p className="mt-3 whitespace-pre-line text-sm text-stone-600">{s.description}</p>}

            {(s.images as unknown as string[]).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(s.images as unknown as string[]).map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt="Property" className="h-16 w-24 rounded-lg border border-stone-200 object-cover" />
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
