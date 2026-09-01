'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { fail, ok, type ActionState } from '../shared';

export async function createUser(_: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireRoles(['ADMIN']);
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '').toLowerCase();
  const role = String(formData.get('role') || '');
  const password = String(formData.get('password') || '');

  if (!name || !email || !password) return fail('Name, email and password are required.');
  if (!['ADMIN', 'MANAGER', 'AGENT'].includes(role)) return fail('Invalid role.');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail('A user with this email already exists.');

  await prisma.user.create({
    data: { name, email, role: role as never, passwordHash: await hashPassword(password) },
  });
  await logAudit({ userId: session.sub, action: 'USER_CREATED', entity: 'User', metadata: { email, role } });
  revalidatePath('/admin/users');
  return ok('User created.');
}

export async function updateUserPermissions(userId: string, role: string, isActive: boolean): Promise<ActionState> {
  const session = await requireRoles(['ADMIN']);
  await prisma.user.update({ where: { id: userId }, data: { role: role as never, isActive } });
  await logAudit({ userId: session.sub, action: 'USER_PERMISSIONS_CHANGED', entity: 'User', entityId: userId, metadata: { role, isActive } });
  revalidatePath('/admin/users');
  return ok('User updated.');
}

export async function toggleUserActive(userId: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN']);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
  if (!user) return fail('User not found.');
  await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  await logAudit({ userId: session.sub, action: 'USER_PERMISSIONS_CHANGED', entity: 'User', entityId: userId });
  revalidatePath('/admin/users');
  return ok('User updated.');
}
