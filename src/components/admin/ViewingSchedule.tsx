'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { scheduleViewing } from '@/actions/admin/viewings';

export default function ViewingSchedule({ viewingId, agents }: { viewingId: string; agents: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [when, setWhen] = useState('');
  const [agentId, setAgentId] = useState('');
  const [msg, setMsg] = useState('');

  const submit = () =>
    startTransition(async () => {
      const res = await scheduleViewing(viewingId, when, agentId);
      setMsg(res.message);
      if (res.ok) router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="input w-auto" aria-label="Schedule date/time" />
      <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="input w-auto" aria-label="Assign agent">
        <option value="">No agent</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <button onClick={submit} disabled={pending || !when} className="btn-primary px-3 py-2 text-xs">
        Schedule
      </button>
      {msg && <span className="text-xs text-stone-500">{msg}</span>}
    </div>
  );
}
