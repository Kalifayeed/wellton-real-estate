import { Prisma } from '@prisma/client';

// Prisma returns Decimal objects; Next.js serialization for client
// components only tolerates plain JSON-safe values. Convert a Decimal to
// a number (or null) explicitly.
export function decToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return value.toNumber();
}
