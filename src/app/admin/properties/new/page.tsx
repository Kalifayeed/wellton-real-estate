import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export const dynamic = 'force-dynamic';

export default async function NewPropertyPage() {
  const [locations, amenities] = await Promise.all([
    prisma.location.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.amenity.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Add Property</h2>
      <PropertyForm locations={locations} amenities={amenities} />
    </div>
  );
}
