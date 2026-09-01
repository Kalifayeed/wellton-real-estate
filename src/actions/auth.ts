'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, createSession, destroySession, getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { fail, ok, zodToFieldErrors, type ActionState } from './shared';

export async function login(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please check your email and password.', { fieldErrors: zodToFieldErrors(parsed.error) });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) return fail('Invalid email or password.');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return fail('Invalid email or password.');

  await createSession({ sub: user.id, role: user.role, name: user.name, email: user.email });
  await logAudit({ userId: user.id, action: 'OTHER', entity: 'User', entityId: user.id, metadata: { note: 'Logged in' } });

  const dashboard = user.role === 'ADMIN' ? '/admin' : user.role === 'MANAGER' ? '/admin' : '/agent';
  redirect(dashboard);
  return ok('ok');
}

export async function logout(): Promise<void> {
  const session = await getSession();
  if (session) await destroySession();
  redirect('/login');
}
