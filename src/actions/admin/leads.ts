'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { fail, ok, type ActionState } from '../shared';

export async function assignLead(leadId: string, agentId: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  if (!agentId) return ok('No agent assigned.');
  try {
    await prisma.$transaction([
      prisma.lead.update({ where: { id: leadId }, data: { assignedToId: agentId } }),
      prisma.leadAssignment.create({ data: { leadId, agentId, assignedBy: session.sub } }),
      prisma.leadActivity.create({ data: { leadId, userId: session.sub, type: 'assignment', note: `Assigned to agent ${agentId}` } }),
    ]);
    await logAudit({ userId: session.sub, action: 'LEAD_ASSIGNED', entity: 'Lead', entityId: leadId, metadata: { agentId } });
    revalidatePath(`/admin/leads/${leadId}`);
    return ok('Lead assigned.');
  } catch (e) {
    console.error('[assignLead]', e);
    return fail('Could not assign lead.');
  }
}

export async function updateLeadStatus(leadId: string, status: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER', 'AGENT']);
  try {
    await prisma.$transaction([
      prisma.lead.update({ where: { id: leadId }, data: { status: status as never } }),
      prisma.leadActivity.create({ data: { leadId, userId: session.sub, type: 'status', note: `Status changed to ${status}` } }),
    ]);
    await logAudit({ userId: session.sub, action: 'LEAD_STATUS_CHANGED', entity: 'Lead', entityId: leadId, metadata: { status } });
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath('/admin/leads');
    return ok('Status updated.');
  } catch (e) {
    console.error('[updateLeadStatus]', e);
    return fail('Could not update status.');
  }
}

export async function addLeadNote(leadId: string, note: string, followUpDate?: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER', 'AGENT']);
  if (!note.trim()) return fail('Note is required.');
  try {
    await prisma.leadActivity.create({
      data: {
        leadId,
        userId: session.sub,
        type: 'note',
        note: note.trim(),
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      },
    });
    revalidatePath(`/admin/leads/${leadId}`);
    return ok('Note added.');
  } catch (e) {
    console.error('[addLeadNote]', e);
    return fail('Could not add note.');
  }
}
