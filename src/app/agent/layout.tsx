import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import { agentNav } from '@/components/admin/AdminNav';

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <AdminShell user={{ name: session.name, role: session.role }} items={agentNav} title="Agent Workspace">
      {children}
    </AdminShell>
  );
}
