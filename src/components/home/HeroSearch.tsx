'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOCATIONS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import { SearchIcon, BuildingIcon, BedIcon } from '@/components/shared/Icons';

export default function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<'SALE' | 'RENT'>('SALE');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('property_search', { mode, location, type, bedrooms });
    const params = new URLSearchParams();
    params.set('purpose', mode);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (bedrooms) params.set('bedrooms', bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-card bg-white p-4 shadow-card sm:p-5 lg:max-w-4xl"
    >
      {/* Buy / Rent toggle */}
      <div className="mb-4 inline-flex rounded-full bg-stone-100 p-1">
        {(['SALE', 'RENT'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              mode === m ? 'bg-brand-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {m === 'SALE' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
          <BuildingIcon className="h-5 w-5 shrink-0 text-stone-500" />
          <select
            aria-label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">Any location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
          <BuildingIcon className="h-5 w-5 shrink-0 text-stone-500" />
          <select
            aria-label="Property type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">Any type</option>
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="TOWNHOUSE">Townhouse</option>
            <option value="VILLA">Villa</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
        </label>

        <label className="flex items-center gap-2.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
          <BedIcon className="h-5 w-5 shrink-0 text-stone-500" />
          <select
            aria-label="Bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">Any bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <button type="submit" className="btn-primary py-3">
          <SearchIcon className="h-5 w-5" /> Search
        </button>
      </div>
    </form>
  );
}
