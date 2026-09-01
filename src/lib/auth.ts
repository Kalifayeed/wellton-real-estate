import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';

const SESSION_COOKIE = 'wellton_session';

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string;
  role: Role;
  name: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: Omit<SessionPayload, 'sub'> & { sub: string }): Promise<string> {
  return new SignJWT({ role: payload.role, name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== 'string') return null;
    return {
      sub: payload.sub,
      role: payload.role as Role,
      name: (payload.name as string) ?? '',
      email: (payload.email as string) ?? '',
    };
  } catch {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'sub'> & { sub: string }): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// Authorization helpers used inside Server Actions / Route Handlers.
const ROLE_PRIORITY: Record<Role, number> = { ADMIN: 3, MANAGER: 2, AGENT: 1 };

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireRoles(allowed: Role[]): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  if (!allowed.includes(session.role)) throw new Error('Forbidden');
  return session;
}

export function canManageAgents(role: Role): boolean {
  return role === 'ADMIN' || role === 'MANAGER';
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN';
}

export function roleHasAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_PRIORITY[role] >= ROLE_PRIORITY[minimum];
}
