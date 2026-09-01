'use client';

import { LOCATIONS, salePriceBands, rentalPriceBands } from '@/lib/constants';
import type { PropertyType } from '@prisma/client';

export interface FilterValues {
  listingPurpose?: string;
  location?: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  min?: string;
  max?: string;
  furnishing?: string;
  status?: string;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'OFF_PLAN_DEVELOPMENT', label: 'Off-Plan Development' },
  { value: 'COMPLETED_DEVELOPMENT', label: 'Completed Development' },
  { value: 'INVESTMENT', label: 'Investment Property' },
  { value: 'COMMERCIAL', label: 'Commercial Property' },
];

const statuses = [
  { value: 'OFF_PLAN', label: 'Off-Plan' },
  { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'READY_TO_MOVE_IN', label: 'Ready to Move In' },
  { value: 'AVAILABLE_FOR_RENT', label: 'Available for Rent' },
];

const furnishing = [
  { value: 'FURNISHED', label: 'Furnished' },
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SERVICED', label: 'Serviced' },
];

interface Props {
  purposeScope: 'SALE' | 'RENT' | 'BOTH';
  values: FilterValues;
  setValue: (key: keyof FilterValues, value: string) => void;
  setPurpose: (p: 'SALE' | 'RENT') => void;
  onClear: () => void;
}

export default function FiltersPanel({ purposeScope, values, setValue, setPurpose, onClear }: Props) {
  const bands = purposeScope === 'RENT' ? rentalPriceBands : salePriceBands;

  return (
    <div className="space-y-5">
      {purposeScope === 'BOTH' && (
        <div>
          <span className="label">Buy or Rent</span>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-stone-100 p-1">
            {(['SALE', 'RENT'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  (values.listingPurpose || purposeScope) === p
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p === 'SALE' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="loc" className="label">Location</label>
        <select id="loc" className="input" value={values.location || ''} onChange={(e) => setValue('location', e.target.value)}>
          <option value="">All locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="label">Property type</label>
        <select id="type" className="input" value={values.propertyType || ''} onChange={(e) => setValue('propertyType', e.target.value)}>
          <option value="">All types</option>
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="beds" className="label">Bedrooms</label>
          <select id="beds" className="input" value={values.bedrooms || ''} onChange={(e) => setValue('bedrooms', e.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div>
          <label htmlFor="baths" className="label">Bathrooms</label>
          <select id="baths" className="input" value={values.bathrooms || ''} onChange={(e) => setValue('bathrooms', e.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="price" className="label">{purposeScope === 'RENT' ? 'Rent (per month)' : 'Price range'}</label>
        <select
          id="price"
          className="input"
          value={values.min && values.max ? `${values.min}-${values.max}` : ''}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-');
            setValue('min', min || '');
            setValue('max', max || '');
          }}
        >
          <option value="">Any price</option>
          {bands.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="furn" className="label">Furnishing</label>
        <select id="furn" className="input" value={values.furnishing || ''} onChange={(e) => setValue('furnishing', e.target.value)}>
          <option value="">Any</option>
          {furnishing.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="label">Status</label>
        <select id="status" className="input" value={values.status || ''} onChange={(e) => setValue('status', e.target.value)}>
          <option value="">Any</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:border-brand-600 hover:text-brand-700"
      >
        Clear Filters
      </button>
    </div>
  );
}



