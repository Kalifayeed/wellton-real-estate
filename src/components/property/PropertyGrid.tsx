import PropertyCard, { type PropertyCardData } from './PropertyCard';
import { SearchIcon } from '@/components/shared/Icons';

interface Props {
  properties: PropertyCardData[];
  emptyMessage?: string;
  clearFilters?: { href: string; label: string }[];
}

export default function PropertyGrid({ properties, emptyMessage, clearFilters }: Props) {
  if (properties.length === 0) {
    return (
      <div className="rounded-card border border-stone-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <SearchIcon className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-stone-900">
          No properties match your current filters
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          {emptyMessage ||
            'Try adjusting your search criteria, or explore more of what Wellton has to offer.'}
        </p>
        {clearFilters && clearFilters.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {clearFilters.map((c) => (
              <a key={c.href} href={c.href} className="btn-secondary">
                {c.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
