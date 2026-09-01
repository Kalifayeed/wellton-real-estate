'use client';

import { useActionState } from 'react';
import { submitPropertyManagement } from '@/actions/leads';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function PropertyManagementForm() {
  const [state, formAction, pending] = useActionState(submitPropertyManagement, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Request received" message={state.message}>
        <a href={buildWhatsAppLink(genericMessage('manage'))} target="_blank" rel="noreferrer" className="btn-whatsapp inline-flex">
          <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </SuccessPanel>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Honeypot />
      <ErrorAlert message={state.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Your name" name="name" required placeholder="Your name" error={fe.name} />
        <TextField label="Phone" name="phone" required type="tel" placeholder="+254 700 000 000" error={fe.phone} />
      </div>
      <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Property location" name="propertyLocation" error={fe.propertyLocation}>
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
        <SelectField label="Property type" name="propertyType">
          <option value="">Select type</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="TOWNHOUSE">Townhouse</option>
          <option value="VILLA">Villa</option>
          <option value="COMMERCIAL">Commercial</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Bedrooms" name="bedrooms">
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5+</option>
        </SelectField>
        <TextField label="Rental price (KSh/month)" name="rentalPrice" type="number" placeholder="e.g. 120000" error={fe.rentalPrice} />
        <SelectField label="Furnishing" name="furnishStatus">
          <option value="">—</option>
          <option value="FURNISHED">Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SERVICED">Serviced</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Availability" name="availability">
          <option value="">—</option>
          <option value="Immediately">Immediately</option>
          <option value="1 month">Within 1 month</option>
          <option value="3 months">Within 3 months</option>
          <option value="Subject to tenancy">Subject to tenancy</option>
        </SelectField>
        <SelectField label="Service needed" name="serviceType">
          <option value="">—</option>
          <option value="PROPERTY_MANAGEMENT">Full property management</option>
          <option value="TENANT_SOURCING">Tenant sourcing</option>
          <option value="RENTAL_VALUATION">Rental valuation</option>
          <option value="PROPERTY_MARKETING">Property marketing</option>
        </SelectField>
      </div>
      <TextAreaField label="Message" name="message" placeholder="Tell us about your property and what you need help with." error={fe.message} />

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Submitting…' : 'Request a Callback'}
      </button>
    </form>
  );
}
