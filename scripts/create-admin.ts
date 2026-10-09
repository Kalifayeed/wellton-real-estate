import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

async function main() {
  const input = z.object({
    ADMIN_EMAIL: z.string().email().transform((email) => email.toLowerCase()),
    ADMIN_NAME: z.string().trim().min(1),
    ADMIN_PASSWORD: z.string().min(16).max(72),
  }).safeParse(process.env);
  if (!input.success) throw new Error('Set ADMIN_EMAIL, ADMIN_NAME and a 16–72 character ADMIN_PASSWORD.');
  const prisma = new PrismaClient();
  try {
    const { ADMIN_EMAIL: email, ADMIN_NAME: name, ADMIN_PASSWORD: password } = input.data;
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new Error('An account with that email already exists; nothing was changed.');
    }
    await prisma.user.create({ data: {
      email, name, role: 'ADMIN', isActive: true, passwordHash: await bcrypt.hash(password, 12),
    } });
    console.log('Administrator created. Remove ADMIN_PASSWORD from the environment.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Could not create administrator.');
  process.exitCode = 1;
});
