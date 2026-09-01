'use client';

import { useActionState } from 'react';
import { submitInquiry } from '@/actions/leads';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

interface Props {
  propertyId: string;
  propertyTitle: string;
  purpose: 'SALE' | 'RENT' | 'BOTH';
}

export default function InquiryForm({ propertyId, propertyTitle, purpose }: Props) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Enquiry received" message={state.message}>
        <a
          href={buildWhatsAppLink(`Hello Wellton, I am interested in ${propertyTitle}.`)}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" /> Continue on WhatsApp
        </a>
      </SuccessPanel>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Honeypot />
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="purpose" value={purpose} />

      <ErrorAlert message={state.message} />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" name="name" required placeholder="Your name" error={fe.name} />
        <TextField label="Phone" name="phone" required type="tel" placeholder="+254 700 000 000" error={fe.phone} />
      </div>
      <TextField label="Email" name="email" type="email" placeholder="you@example.com" error={fe.email} />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Preferred contact method" name="contactMethod" error={fe.contactMethod}>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="PHONE">Phone call</option>
          <option value="EMAIL">Email</option>
        </SelectField>
        <SelectField label="How can we help?" name="inquiryType" error={fe.inquiryType}>
          <option value="MORE_INFORMATION">Request more information</option>
          <option value="SCHEDULE_VIEWING">Schedule a viewing</option>
          <option value="APPLY_TO_RENT">Apply to rent</option>
          <option value="PAYMENT_TERMS">Ask about payment terms</option>
          <option value="VIRTUAL_VIEWING">Request a virtual viewing</option>
        </SelectField>
      </div>

      <TextField label="Preferred viewing date" name="viewingDate" type="date" error={fe.viewingDate} />

      <TextAreaField
        label="Message"
        name="message"
        required
        placeholder={`I would like more information about ${propertyTitle}.`}
        error={fe.message}
      />

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Sending…' : 'Send Enquiry'}
      </button>
      <p className="text-center text-xs text-stone-500">
        Your enquiry creates a lead with our team. We typically respond within a few hours.
      </p>
    </form>
  );
}
