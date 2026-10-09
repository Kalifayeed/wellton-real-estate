'use client';

import { useActionState } from 'react';
import UploadForm from './UploadForm';
import { submitRentalApplication } from '@/actions/submissions';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

interface Props {
  propertyId: string;
  propertyTitle: string;
}

export default function RentalApplicationForm({ propertyId, propertyTitle }: Props) {
  const [state, formAction, pending] = useActionState(submitRentalApplication, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Application submitted" message={state.message}>
        <a
          href={buildWhatsAppLink(`Hello Wellton, I have just submitted a rental application for ${propertyTitle}.`)}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" /> Follow up on WhatsApp
        </a>
      </SuccessPanel>
    );
  }

  return (
    <UploadForm action={formAction} className="space-y-4">
      <Honeypot />
      <input type="hidden" name="propertyId" value={propertyId} />
      <ErrorAlert message={state.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" name="name" required placeholder="Your name" error={fe.name} />
        <TextField label="Phone" name="phone" required type="tel" placeholder="+254 700 000 000" error={fe.phone} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />
        <TextField label="Current address" name="currentAddress" placeholder="Where you live now" error={fe.currentAddress} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Preferred move-in date" name="moveInDate" type="date" error={fe.moveInDate} />
        <SelectField label="Desired lease duration" name="leaseDuration">
          <option value="">—</option>
          <option value="6 months">6 months</option>
          <option value="12 months">12 months</option>
          <option value="24 months">24 months</option>
          <option value="Flexible">Flexible</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Employment status" name="employmentStatus">
          <option value="">—</option>
          <option value="Employed">Employed</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Business owner">Business owner</option>
          <option value="Student">Student</option>
          <option value="Retiree">Retiree</option>
        </SelectField>
        <TextField label="Employer / business" name="employer" error={fe.employer} />
        <SelectField label="Monthly income" name="incomeRange">
          <option value="">—</option>
          <option value="Under 50K">Under KSh 50K</option>
          <option value="50K - 100K">KSh 50K – 100K</option>
          <option value="100K - 200K">KSh 100K – 200K</option>
          <option value="200K - 350K">KSh 200K – 350K</option>
          <option value="Over 350K">Over KSh 350K</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Number of occupants" name="occupants">
          <option value="">—</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </SelectField>
        <TextField label="References" name="references" placeholder="Contact for a reference" error={fe.references} />
      </div>
      <TextAreaField label="Additional information" name="additionalInfo" placeholder="Anything else we should know?" error={fe.additionalInfo} />
      <div>
        <label htmlFor="documents" className="label">Supporting documents</label>
        <input id="documents" name="documents" type="file" accept=".pdf,image/*" multiple className="input py-2" />
        <p className="mt-1 text-xs text-stone-500">ID / passport, proof of income, etc. Stored securely and only used to assess your application.</p>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Submitting application…' : 'Submit Rental Application'}
      </button>
    </UploadForm>
  );
}
