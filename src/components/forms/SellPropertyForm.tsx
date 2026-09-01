'use client';

import { useActionState } from 'react';
import { submitOwnerSubmission } from '@/actions/submissions';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function SellPropertyForm() {
  const [state, formAction, pending] = useActionState(submitOwnerSubmission, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Property submitted" message={state.message}>
        <a href={buildWhatsAppLink(genericMessage('sell'))} target="_blank" rel="noreferrer" className="btn-whatsapp inline-flex">
          <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </SuccessPanel>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Honeypot />
      <ErrorAlert message={state.message} />
      <p className="text-sm text-stone-500">
        Tell us about the property you would like us to help sell or let. Our team reviews every
        submission before it is published.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Owner name" name="ownerName" required placeholder="Your name" error={fe.ownerName} />
        <TextField label="Phone" name="phone" required type="tel" placeholder="+254 700 000 000" error={fe.phone} />
      </div>
      <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Location" name="location" error={fe.location}>
          <option value="">Select area</option>
          <option value="Kilimani">Kilimani</option>
          <option value="Kileleshwa">Kileleshwa</option>
          <option value="Lavington">Lavington</option>
          <option value="Westlands">Westlands</option>
          <option value="Karen">Karen</option>
          <option value="Runda">Runda</option>
          <option value="Kitisuru">Kitisuru</option>
          <option value="Muthaiga">Muthaiga</option>
          <option value="Loresho">Loresho</option>
          <option value="Upper Hill">Upper Hill</option>
          <option value="Other">Other</option>
        </SelectField>
        <SelectField label="Property type" name="propertyType" error={fe.propertyType}>
          <option value="">Select type</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="TOWNHOUSE">Townhouse</option>
          <option value="VILLA">Villa</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="LAND">Land</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Bedrooms" name="bedrooms" error={fe.bedrooms}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5+</option>
        </SelectField>
        <TextField label="Asking price (KSh)" name="askingPrice" type="number" placeholder="e.g. 25000000" error={fe.askingPrice} />
        <TextField label="Rental price (KSh/month)" name="rentalPrice" type="number" placeholder="e.g. 120000" error={fe.rentalPrice} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Furnishing" name="furnishStatus">
          <option value="">—</option>
          <option value="FURNISHED">Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SERVICED">Serviced</option>
        </SelectField>
        <SelectField label="Availability" name="availability">
          <option value="">—</option>
          <option value="Immediately">Immediately</option>
          <option value="1 month">Within 1 month</option>
          <option value="3 months">Within 3 months</option>
          <option value="Subject to tenancy">Subject to tenancy</option>
        </SelectField>
      </div>
      <TextAreaField label="Property description" name="description" required placeholder="Describe the property, its condition and features." error={fe.description} />
      <div>
        <label htmlFor="images" className="label">Property images</label>
        <input id="images" name="images" type="file" accept="image/*" multiple className="input py-2" />
        <p className="mt-1 text-xs text-stone-500">JPEG, PNG or WebP. Up to a few images at a time. Images are reviewed before publication.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Preferred service" name="serviceType">
          <option value="">—</option>
          <option value="SELL_MY_PROPERTY">Sell my property</option>
          <option value="RENT_OUT_PROPERTY">Rent out my property</option>
          <option value="PROPERTY_MANAGEMENT">Property management</option>
          <option value="RENTAL_VALUATION">Rental valuation</option>
          <option value="TENANT_SOURCING">Tenant sourcing</option>
          <option value="PROPERTY_MARKETING">Property marketing</option>
        </SelectField>
        <SelectField label="Preferred contact method" name="contactMethod">
          <option value="PHONE">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
        </SelectField>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Submitting…' : 'Submit Property'}
      </button>
    </form>
  );
}
