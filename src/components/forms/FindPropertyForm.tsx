'use client';

import { useActionState } from 'react';
import { submitFindProperty } from '@/actions/leads';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function FindPropertyForm() {
  const [state, formAction, pending] = useActionState(submitFindProperty, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Request received" message={state.message}>
        <a href={buildWhatsAppLink(genericMessage('find-property'))} target="_blank" rel="noreferrer" className="btn-whatsapp inline-flex">
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
        <TextField label="Full name" name="name" required placeholder="Your name" error={fe.name} />
        <TextField label="Phone" name="phone" required type="tel" placeholder="+254 700 000 000" error={fe.phone} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />
        <TextField label="Current country" name="currentCountry" placeholder="e.g. Kenya, UK, USA" error={fe.currentCountry} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="I want to" name="listingPurpose" error={fe.listingPurpose}>
          <option value="BOTH">Either</option>
          <option value="SALE">Buy</option>
          <option value="RENT">Rent</option>
        </SelectField>
        <SelectField label="Preferred location" name="preferredLocation" error={fe.preferredLocation}>
          <option value="">Anywhere in Nairobi</option>
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
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Property type" name="propertyType" error={fe.propertyType}>
          <option value="">Any</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="TOWNHOUSE">Townhouse</option>
          <option value="VILLA">Villa</option>
          <option value="COMMERCIAL">Commercial</option>
        </SelectField>
        <SelectField label="Bedrooms" name="bedrooms" error={fe.bedrooms}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </SelectField>
        <SelectField label="Bathrooms" name="bathrooms" error={fe.bathrooms}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </SelectField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Budget" name="budget" type="number" placeholder="e.g. 15000000" error={fe.budget} />
        <SelectField label="Budget frequency" name="budgetFrequency">
          <option value="">—</option>
          <option value="MONTHLY">Per month (rent)</option>
          <option value="YEARLY">Per year</option>
          <option value="WEEKLY">Per week</option>
        </SelectField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Purpose" name="purpose" error={fe.purpose}>
          <option value="">—</option>
          <option value="LIVING">Living</option>
          <option value="INVESTMENT">Investment</option>
          <option value="RENTAL_INCOME">Rental income</option>
          <option value="FAMILY_USE">Family use</option>
          <option value="SHORT_TERM_ACCOMMODATION">Short-term accommodation</option>
          <option value="RELOCATION">Relocation</option>
        </SelectField>
        <SelectField label="Preferred status" name="preferredStatus">
          <option value="">Either</option>
          <option value="OFF_PLAN">Off-plan</option>
          <option value="COMPLETED">Completed</option>
          <option value="AVAILABLE_FOR_RENT">Available for rent</option>
        </SelectField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Furnishing" name="furnishStatus">
          <option value="">Either</option>
          <option value="FURNISHED">Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SERVICED">Serviced</option>
        </SelectField>
        <TextField label="Preferred move-in date" name="moveInDate" type="date" error={fe.moveInDate} />
      </div>

      <TextAreaField label="Additional requirements" name="requirements" placeholder="Tell us anything else that matters to you." error={fe.requirements} />

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  );
}
