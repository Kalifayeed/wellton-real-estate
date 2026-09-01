import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { labelOf } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import PropertyRowActions from '@/components/admin/PropertyRowActions';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { location: true, images: { take: 1, orderBy: { isCover: 'desc' } } },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Properties</h2>
          <p className="text-sm text-stone-500">{properties.length} total</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">Add Property</Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {properties.map((p) => {
              const price = p.listingPurpose === 'RENT' ? p.rentalPrice : p.price;
              return (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{p.title}</p>
                    <p className="text-xs text-stone-500">{labelOf('propertyType', p.propertyType)} · {labelOf('listingPurpose', p.listingPurpose)}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{p.location.name}</td>
                  <td className="px-4 py-3 text-stone-800">{price ? formatCurrency(price.toNumber()) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-stone-100 text-stone-700">{labelOf('propertyStatus', p.propertyStatus)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {p.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PropertyRowActions id={p.id} isPublished={p.isPublished} isFeatured={p.isFeatured} />
                  </td>
                </tr>
              );
            })}
            {properties.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-stone-500">No properties yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
