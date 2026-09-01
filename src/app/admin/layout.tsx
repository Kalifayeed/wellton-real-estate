import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import { adminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role === 'AGENT') redirect('/agent');

  return (
    <AdminShell user={{ name: session.name, role: session.role }} items={adminNav} title="Dashboard">
      {children}
    </AdminShell>
  );
}
