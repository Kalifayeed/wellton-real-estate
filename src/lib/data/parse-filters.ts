import type { PropertyFilters } from './queries';
import type { ListingPurpose, PropertyType } from '@prisma/client';

// Parse URL search params into structured filters for the query layer.
export function parseFilters(sp: Record<string, string | string[] | undefined>): PropertyFilters {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const purpose = get('purpose');
  const min = get('min');
  const max = get('max');

  return {
    listingPurpose: purpose && ['SALE', 'RENT'].includes(purpose) ? (purpose as ListingPurpose) : undefined,
    location: get('location') || undefined,
    propertyType: get('type') ? (get('type') as PropertyType) : undefined,
    bedrooms: get('bedrooms') ? Number(get('bedrooms')) : undefined,
    bathrooms: get('bathrooms') ? Number(get('bathrooms')) : undefined,
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
    furnishing: get('furnishing') as PropertyFilters['furnishing'] || undefined,
    status: get('status') || undefined,
    sort: get('sort') as PropertyFilters['sort'] || undefined,
    q: get('q') || undefined,
  };
}
