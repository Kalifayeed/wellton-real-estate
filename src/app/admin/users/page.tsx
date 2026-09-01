import { prisma } from '@/lib/prisma';
import UserManager from '@/components/admin/UserManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Users &amp; Permissions</h2>
        <p className="text-sm text-stone-500">Manage team accounts, roles and access.</p>
      </div>
      <UserManager users={users} />
    </>
  );
}
