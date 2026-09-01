import { ZodError } from 'zod';

export interface ActionState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  leadId?: string;
  entityId?: string;
}

export function ok(message: string, extra?: Partial<ActionState>): ActionState {
  return { ok: true, message, ...extra };
}

export function fail(message: string, extra?: Partial<ActionState>): ActionState {
  return { ok: false, message, ...extra };
}

export function zodToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
