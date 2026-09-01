'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { fail, ok, type ActionState } from '../shared';

export async function scheduleViewing(viewingId: string, scheduledAt: string, agentId: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER', 'AGENT']);
  if (!scheduledAt) return fail('Please choose a date and time.');
  try {
    const viewing = await prisma.viewing.findUnique({ where: { id: viewingId }, select: { leadId: true } });
    await prisma.viewing.update({
      where: { id: viewingId },
      data: { scheduledAt: new Date(scheduledAt), agentId: agentId || undefined, status: 'SCHEDULED' },
    });
    if (viewing?.leadId) {
      await prisma.leadActivity.create({
        data: { leadId: viewing.leadId, userId: session.sub, type: 'status', note: `Viewing scheduled for ${new Date(scheduledAt).toLocaleString()}` },
      });
    }
    await logAudit({ userId: session.sub, action: 'VIEWING_SCHEDULED', entity: 'Viewing', entityId: viewingId });
    revalidatePath('/admin/viewings');
    return ok('Viewing scheduled.');
  } catch (e) {
    console.error('[scheduleViewing]', e);
    return fail('Could not schedule viewing.');
  }
}

export async function updateViewingStatus(viewingId: string, status: string, notes?: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER', 'AGENT']);
  try {
    await prisma.viewing.update({
      where: { id: viewingId },
      data: { status: status as never, notes: notes || undefined },
    });
    await logAudit({ userId: session.sub, action: 'OTHER', entity: 'Viewing', entityId: viewingId, metadata: { status } });
    revalidatePath('/admin/viewings');
    revalidatePath('/agent/viewings');
    return ok('Viewing updated.');
  } catch (e) {
    console.error('[updateViewingStatus]', e);
    return fail('Could not update viewing.');
  }
}
