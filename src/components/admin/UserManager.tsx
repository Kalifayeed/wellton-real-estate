'use client';

import { useActionState, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUserPermissions, toggleUserActive } from '@/actions/admin/users';
import { ErrorAlert, SuccessPanel, TextField, SelectField } from '@/components/ui/form-fields';
import type { ActionState } from '@/actions/shared';

const initialState: ActionState = { ok: false, message: '' };

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UserManager({ users }: { users: UserRow[] }) {
  const [state, formAction, pending] = useActionState(createUser, initialState);
  const [wait, startTransition] = useTransition();
  const [messages, setMessages] = useState<Record<string, string>>({});
  const router = useRouter();

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="rounded-card border border-stone-200 bg-white p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">Add user</h3>
        {state.ok ? (
          <SuccessPanel title="Added" message={state.message} />
        ) : (
          <form action={formAction} className="space-y-3">
            <ErrorAlert message={state.message} />
            <TextField label="Full name" name="name" required placeholder="Name" error={state.fieldErrors?.name} />
            <TextField label="Email" name="email" type="email" required placeholder="you@wellton.com" error={state.fieldErrors?.email} />
            <SelectField label="Role" name="role" defaultValue="AGENT">
              <option value="AGENT">Agent</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrator</option>
            </SelectField>
            <TextField label="Password" name="password" type="password" required minLength={8} placeholder="Min 8 characters" />
            <button type="submit" disabled={pending} className="btn-primary w-full">{pending ? 'Adding…' : 'Create User'}</button>
          </form>
        )}
      </div>

      <div className="overflow-x-auto rounded-card border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{u.name}</p>
                  <p className="text-xs text-stone-500">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      startTransition(async () => {
                        const res = await updateUserPermissions(u.id, e.target.value, u.isActive);
                        setMessages((m) => ({ ...m, [u.id]: res.message }));
                        router.refresh();
                      })
                    }
                    disabled={wait}
                    className="input w-auto"
                  >
                    <option value="AGENT">Agent</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        const res = await toggleUserActive(u.id);
                        setMessages((m) => ({ ...m, [u.id]: res.message }));
                        router.refresh();
                      })
                    }
                    disabled={wait}
                    className="btn-secondary px-2.5 py-1.5 text-xs"
                  >
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                  {messages[u.id] && <span className="ml-2 text-xs text-stone-500">{messages[u.id]}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
