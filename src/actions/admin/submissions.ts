'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { ok, type ActionState } from '../shared';

export async function updateSubmissionStatus(submissionId: string, status: string, note?: string): Promise<ActionState> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  await prisma.$transaction([
    prisma.ownerSubmission.update({
      where: { id: submissionId },
      data: { status: status as never, reviewedById: session.sub, reviewedNote: note || undefined },
    }),
    prisma.submissionReview.create({
      data: { submissionId, reviewerId: session.sub, status: status as never, note: note || undefined },
    }),
  ]);
  await logAudit({ userId: session.sub, action: 'SUBMISSION_UPDATED', entity: 'OwnerSubmission', entityId: submissionId, metadata: { status } });
  revalidatePath('/admin/submissions');
  return ok('Submission updated.');
}
