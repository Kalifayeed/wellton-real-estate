'use client';

import { useActionState } from 'react';
import { createProperty, updateProperty } from '@/actions/admin/properties';
import { ErrorAlert, SuccessPanel } from '@/components/ui/form-fields';
import type { ActionState } from '@/actions/shared';
import type { Property } from '@prisma/client';

const initialState: ActionState = { ok: false, message: '' };

interface Props {
  property?: Property | null;
  locations: { id: string; name: string }[];
  amenities: { id: string; name: string }[];
}

export default function PropertyForm({ property, locations, amenities }: Props) {
  const action = property ? updateProperty : createProperty;
  const [state, formAction, pending] = useActionState(action, initialState);

  const selectedAmenityIds = new Set(
    ((property as unknown as { amenities?: { amenityId: string }[] })?.amenities ?? []).map((a) => a.amenityId)
  );

  if (state.ok) {
    return <SuccessPanel title="Saved" message={state.message} />;
  }

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {property && <input type="hidden" name="id" value={property.id} />}
      <ErrorAlert message={state.message} />

      {/* Basics */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="label">Title *</label>
            <input id="title" name="title" defaultValue={property?.title ?? ''} className="input" required />
          </div>
          <div>
            <label htmlFor="slug" className="label">Slug</label>
            <input id="slug" name="slug" defaultValue={property?.slug ?? ''} className="input" placeholder="auto-generated from title" />
          </div>
          <div>
            <label htmlFor="locationId" className="label">Location *</label>
            <select id="locationId" name="locationId" className="input" defaultValue={property?.locationId ?? ''} required>
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="area" className="label">Area / sub-location</label>
            <input id="area" name="area" defaultValue={property?.area ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="propertyType" className="label">Property type</label>
            <select id="propertyType" name="propertyType" className="input" defaultValue={property?.propertyType ?? ''}>
              <option value="">—</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="VILLA">Villa</option>
              <option value="OFF_PLAN_DEVELOPMENT">Off-Plan Development</option>
              <option value="COMPLETED_DEVELOPMENT">Completed Development</option>
              <option value="INVESTMENT">Investment Property</option>
              <option value="COMMERCIAL">Commercial Property</option>
              <option value="LAND">Land</option>
            </select>
          </div>
          <div>
            <label htmlFor="listingPurpose" className="label">Listing purpose</label>
            <select id="listingPurpose" name="listingPurpose" className="input" defaultValue={property?.listingPurpose ?? ''}>
              <option value="">—</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
              <option value="BOTH">Sale & Rent</option>
            </select>
          </div>
          <div>
            <label htmlFor="propertyStatus" className="label">Status</label>
            <select id="propertyStatus" name="propertyStatus" className="input" defaultValue={property?.propertyStatus ?? ''}>
              <option value="">—</option>
              <option value="OFF_PLAN">Off-Plan</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="COMPLETED">Completed</option>
              <option value="READY_TO_MOVE_IN">Ready to Move In</option>
              <option value="AVAILABLE_FOR_RENT">Available for Rent</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pricing & specs */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Pricing &amp; Specs</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="price" className="label">Sale price (KSh)</label>
            <input id="price" name="price" type="number" defaultValue={property?.price?.toString() ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="rentalPrice" className="label">Rental price (KSh)</label>
            <input id="rentalPrice" name="rentalPrice" type="number" defaultValue={property?.rentalPrice?.toString() ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="rentalFrequency" className="label">Rental frequency</label>
            <select id="rentalFrequency" name="rentalFrequency" className="input" defaultValue={property?.rentalFrequency ?? ''}>
              <option value="">—</option>
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div>
            <label htmlFor="securityDeposit" className="label">Security deposit (KSh)</label>
            <input id="securityDeposit" name="securityDeposit" type="number" defaultValue={property?.securityDeposit?.toString() ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="serviceCharge" className="label">Service charge (KSh)</label>
            <input id="serviceCharge" name="serviceCharge" type="number" defaultValue={property?.serviceCharge?.toString() ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="bedrooms" className="label">Bedrooms</label>
            <input id="bedrooms" name="bedrooms" type="number" defaultValue={property?.bedrooms ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="label">Bathrooms</label>
            <input id="bathrooms" name="bathrooms" type="number" defaultValue={property?.bathrooms ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="sizeSqm" className="label">Size (m²)</label>
            <input id="sizeSqm" name="sizeSqm" type="number" defaultValue={property?.sizeSqm ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="furnishStatus" className="label">Furnishing</label>
            <select id="furnishStatus" name="furnishStatus" className="input" defaultValue={property?.furnishStatus ?? ''}>
              <option value="">—</option>
              <option value="FURNISHED">Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SERVICED">Serviced</option>
              <option value="PARTLY_FURNISHED">Partly Furnished</option>
            </select>
          </div>
          <div>
            <label htmlFor="availabilityDate" className="label">Available from</label>
            <input id="availabilityDate" name="availabilityDate" type="date" defaultValue={property?.availabilityDate?.toISOString().slice(0, 10) ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="completionDate" className="label">Completion date</label>
            <input id="completionDate" name="completionDate" type="date" defaultValue={property?.completionDate?.toISOString().slice(0, 10) ?? ''} className="input" />
          </div>
        </div>
      </section>


      {/* Description & rental terms */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Description &amp; Terms</h2>
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" name="description" defaultValue={property?.description ?? ''} rows={5} className="input" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="leaseTerms" className="label">Lease terms</label>
            <input id="leaseTerms" name="leaseTerms" defaultValue={property?.leaseTerms ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="minRentalPeriod" className="label">Minimum rental period</label>
            <input id="minRentalPeriod" name="minRentalPeriod" defaultValue={property?.minRentalPeriod ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="paymentPlan" className="label">Payment plan</label>
            <input id="paymentPlan" name="paymentPlan" defaultValue={property?.paymentPlan ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="tenantRequirement" className="label">Tenant requirements</label>
            <input id="tenantRequirement" name="tenantRequirement" defaultValue={property?.tenantRequirement ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="petPolicy" className="label">Pet policy</label>
            <input id="petPolicy" name="petPolicy" defaultValue={property?.petPolicy ?? ''} className="input" />
          </div>
          <div>
            <label htmlFor="virtualTourUrl" className="label">Virtual tour URL</label>
            <input id="virtualTourUrl" name="virtualTourUrl" defaultValue={property?.virtualTourUrl ?? ''} className="input" />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Amenities</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {amenities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" name="amenities" value={a.id} defaultChecked={selectedAmenityIds.has(a.id)} className="h-4 w-4 rounded border-stone-300 text-brand-700 focus:ring-brand-600" />
              {a.name}
            </label>
          ))}
        </div>
      </section>

      {/* Media */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Media</h2>
        <label htmlFor="images" className="label">Images</label>
        <input id="images" name="images" type="file" accept="image/*" multiple className="input py-2" />
        <p className="mt-2 text-xs text-stone-500">Upload images. The first uploaded image becomes the cover.</p>
      </section>

      {/* Publish */}
      <section className="rounded-card border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="isFeatured" defaultChecked={property?.isFeatured ?? false} className="h-4 w-4 rounded border-stone-300 text-brand-700 focus:ring-brand-600" />
            Mark as featured
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="isPublished" defaultChecked={property?.isPublished ?? true} className="h-4 w-4 rounded border-stone-300 text-brand-700 focus:ring-brand-600" />
            Published (visible on the website)
          </label>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? 'Saving…' : property ? 'Save Changes' : 'Create Property'}
          </button>
        </div>
      </section>
    </form>
  );
}


