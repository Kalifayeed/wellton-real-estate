import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, locations, amenities] = await Promise.all([
    prisma.property.findUnique({ where: { id }, include: { amenities: { select: { amenityId: true } } } }),
    prisma.location.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.amenity.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Edit Property</h2>
      <PropertyForm property={property} locations={locations} amenities={amenities} />
    </div>
  );
}
