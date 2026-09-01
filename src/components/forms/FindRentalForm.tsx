'use client';

import { useActionState } from 'react';
import { submitFindRental } from '@/actions/leads';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function FindRentalForm() {
  const [state, formAction, pending] = useActionState(submitFindRental, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Request received" message={state.message}>
        <a href={buildWhatsAppLink(genericMessage('find-rental'))} target="_blank" rel="noreferrer" className="btn-whatsapp inline-flex">
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
      <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />
      <div className="grid gap-4 sm:grid-cols-2">
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
        <SelectField label="Property type" name="propertyType" error={fe.propertyType}>
          <option value="">Any</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="TOWNHOUSE">Townhouse</option>
          <option value="COMMERCIAL">Commercial</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Bedrooms" name="bedrooms" error={fe.bedrooms}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </SelectField>
        <TextField label="Monthly budget (KSh)" name="budget" type="number" placeholder="e.g. 100000" error={fe.budget} />
        <SelectField label="Furnishing" name="furnishStatus">
          <option value="">Either</option>
          <option value="FURNISHED">Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SERVICED">Serviced</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Move-in date" name="moveInDate" type="date" error={fe.moveInDate} />
        <SelectField label="Rental duration" name="rentalDuration">
          <option value="">—</option>
          <option value="6 months">6 months</option>
          <option value="12 months">12 months</option>
          <option value="24 months">24 months</option>
          <option value="Short-term">Short-term</option>
          <option value="Long-term">Long-term</option>
        </SelectField>
      </div>
      <TextAreaField label="Employment / business information" name="employmentInfo" placeholder="Help us understand your rental application profile." error={fe.employmentInfo} />
      <TextAreaField label="Additional requirements" name="requirements" placeholder="Anything else?" error={fe.requirements} />

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Submitting…' : 'Submit Rental Request'}
      </button>
    </form>
  );
}
