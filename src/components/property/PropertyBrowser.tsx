'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import FiltersPanel, { type FilterValues } from './FiltersPanel';
import { FilterIcon, CloseIcon, ChevronDownIcon } from '@/components/shared/Icons';

interface Props {
  basePath: string;
  purposeScope: 'SALE' | 'RENT' | 'BOTH';
  total: number;
  children: React.ReactNode;
}

export default function PropertyBrowser({ basePath, purposeScope, total, children }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Read current filter state from the URL (single source of truth).
  const values: FilterValues = useMemo(
    () => ({
      listingPurpose: sp.get('purpose') || undefined,
      location: sp.get('location') || undefined,
      propertyType: sp.get('type') || undefined,
      bedrooms: sp.get('bedrooms') || undefined,
      bathrooms: sp.get('bathrooms') || undefined,
      min: sp.get('min') || undefined,
      max: sp.get('max') || undefined,
      furnishing: sp.get('furnishing') || undefined,
      status: sp.get('status') || undefined,
    }),
    [sp]
  );

  const sort = sp.get('sort') || '';

  const pushParams = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams(sp.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === undefined || v === '') params.delete(k);
        else params.set(k, v);
      });
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [router, sp, basePath]
  );

  const setValue = useCallback(
    (key: keyof FilterValues, value: string) => pushParams({ [key]: value }),
    [pushParams]
  );

  const setPurpose = useCallback(
    (p: 'SALE' | 'RENT') => pushParams({ purpose: p, min: undefined, max: undefined }),
    [pushParams]
  );

  const clearFilters = useCallback(() => router.push(basePath), [router, basePath]);

  const hasFilters = Object.values(values).some((v) => v) || !!sort;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-card border border-stone-200 bg-white p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold">Filters</h2>
          <FiltersPanel
            purposeScope={purposeScope}
            values={values}
            setValue={setValue}
            setPurpose={setPurpose}
            onClear={clearFilters}
          />
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 lg:hidden"
            >
              <FilterIcon className="h-4 w-4" /> Filters
              {hasFilters && <span className="h-2 w-2 rounded-full bg-brand-600" />}
            </button>
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{total}</span>{' '}
              {total === 1 ? 'property' : 'properties'}
            </p>
          </div>

          <div className="relative">
            <select
              aria-label="Sort results"
              value={sort}
              onChange={(e) => pushParams({ sort: e.target.value })}
              className="input w-auto pr-9"
            >
              <option value="">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          </div>
        </div>

        {children}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-hidden onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-stone-900/40" />
          <div className="absolute bottom-0 right-0 top-0 flex w-full max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 p-4">
              <span className="font-serif text-lg font-semibold">Filters</span>
              <button
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-800"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FiltersPanel
                purposeScope={purposeScope}
                values={values}
                setValue={setValue}
                setPurpose={setPurpose}
                onClear={() => {
                  clearFilters();
                  setDrawerOpen(false);
                }}
              />
            </div>
            <div className="border-t border-stone-200 p-4">
              <button onClick={() => setDrawerOpen(false)} className="btn-primary w-full">
                Show {total} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
