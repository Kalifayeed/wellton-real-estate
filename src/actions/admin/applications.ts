'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { ok, type ActionState } from '../shared';

export async function updateApplicationStatus(appId: string, status: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER', 'AGENT']);
  await prisma.rentalApplication.update({ where: { id: appId }, data: { status: status as never } });
  if (status === 'APPROVED') {
    await prisma.lead.updateMany({
      where: { applications: { some: { id: appId } } },
      data: { status: 'CLOSED_WON' },
    });
  }
  await logAudit({ userId: session.sub, action: 'APPLICATION_UPDATED', entity: 'RentalApplication', entityId: appId, metadata: { status } });
  revalidatePath('/admin/applications');
  revalidatePath('/agent/applications');
  return ok('Application updated.');
}

export async function assignApplication(appId: string, agentId: string): Promise<ActionState> {
  await requireRoles(['ADMIN', 'MANAGER']);
  await prisma.rentalApplication.update({ where: { id: appId }, data: { assignedToId: agentId || undefined } });
  revalidatePath('/admin/applications');
  return ok('Application assigned.');
}
