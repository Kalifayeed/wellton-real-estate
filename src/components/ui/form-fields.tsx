'use client';

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="field-error">{error}</p>;
}

export function Field({ label, name, error, children, hint }: { label: string; name?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-stone-500">{hint}</p>}
      <ErrorText error={error} />
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <Field label={label} name={props.name} error={error} hint={hint}>
      <input className={`input ${className ?? ''}`} {...props} />
    </Field>
  );
}

export function SelectField({
  label,
  error,
  className,
  children,
  hint,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; hint?: string }) {
  return (
    <Field label={label} name={props.name} error={error} hint={hint}>
      <select className={`input ${className ?? ''}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  className,
  hint,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  return (
    <Field label={label} name={props.name} error={error} hint={hint}>
      <textarea className={`input min-h-[110px] ${className ?? ''}`} {...props} />
    </Field>
  );
}

export function ErrorAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </div>
  );
}

export function SuccessPanel({ title, message, children }: { title: string; message: string; children?: ReactNode }) {
  return (
    <div className="rounded-card border border-brand-200 bg-brand-50 p-6 text-center animate-fade-in">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-serif text-xl font-semibold text-stone-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">{message}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}
