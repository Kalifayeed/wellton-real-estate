'use client';

import { useActionState } from 'react';
import { submitContact } from '@/actions/leads';
import { TextField, SelectField, TextAreaField, ErrorAlert, SuccessPanel, Honeypot } from '@/components/ui/form-fields';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/shared/Icons';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <SuccessPanel title="Message sent" message={state.message}>
        <a href={buildWhatsAppLink(genericMessage())} target="_blank" rel="noreferrer" className="btn-whatsapp inline-flex">
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
        <TextField label="Subject" name="subject" placeholder="How can we help?" error={fe.subject} />
      </div>
      <SelectField label="Inquiry type" name="inquiryType">
        <option value="">—</option>
        <option value="Buying a property">Buying a property</option>
        <option value="Selling a property">Selling a property</option>
        <option value="Renting a property">Renting a property</option>
        <option value="Listing a rental property">Listing a rental property</option>
        <option value="Property management">Property management</option>
        <option value="Diaspora services">Diaspora services</option>
        <option value="General inquiry">General inquiry</option>
      </SelectField>
      <TextAreaField label="Message" name="message" required placeholder="Tell us how we can help you." error={fe.message} />

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
