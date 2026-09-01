import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { AuditAction } from '@prisma/client';

// Log an administrative action to the audit trail.
export async function logAudit(input: {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    // Never let audit logging break the primary operation.
    console.error('[audit] failed to log', e);
  }
}
