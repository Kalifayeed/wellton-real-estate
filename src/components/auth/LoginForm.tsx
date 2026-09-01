'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login } from '@/actions/auth';
import { TextField, ErrorAlert, Honeypot } from '@/components/ui/form-fields';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <div className="rounded-card border border-stone-200 bg-white p-8 shadow-card">
      <div className="mb-6 text-center">
        <span className="font-serif text-2xl font-semibold text-brand-800">Wellton</span>
        <p className="mt-1 text-sm text-stone-500">Staff Sign In</p>
      </div>

      <form action={formAction} className="space-y-4">
        <Honeypot />
        <ErrorAlert message={state.message} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" placeholder="you@wellton.com" error={fe.email} />
        <TextField label="Password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" error={fe.password} />
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-stone-400">
        <Link href="/" className="hover:text-brand-700">← Back to website</Link>
      </p>
    </div>
  );
}
