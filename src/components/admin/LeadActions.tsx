'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { assignLead, updateLeadStatus, addLeadNote } from '@/actions/admin/leads';
import { listLabelMaps } from '@/lib/constants';

export default function LeadActions({
  leadId,
  agents,
  currentAgentId,
  currentStatus,
}: {
  leadId: string;
  agents: { id: string; name: string }[];
  currentAgentId?: string | null;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [agentId, setAgentId] = useState(currentAgentId ?? '');
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [message, setMessage] = useState('');

  const run = (fn: () => Promise<{ ok: boolean; message: string }>, done?: () => void) =>
    startTransition(async () => {
      const res = await fn();
      setMessage(res.message);
      if (res.ok) {
        router.refresh();
        done?.();
      }
    });

  return (
    <div className="space-y-4">
      {message && <p className="text-sm text-stone-600">{message}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="agent" className="label">Assign to agent</label>
          <div className="flex gap-2">
            <select id="agent" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="input">
              <option value="">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <button
              onClick={() => run(() => assignLead(leadId, agentId))}
              disabled={pending}
              className="btn-secondary shrink-0"
            >
              Assign
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="leadStatus" className="label">Lead status</label>
          <div className="flex gap-2">
            <select id="leadStatus" value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              {Object.entries(listLabelMaps.leadStatus).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button
              onClick={() => run(() => updateLeadStatus(leadId, status))}
              disabled={pending}
              className="btn-secondary shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="label">Add follow-up note</label>
        <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="input" placeholder="Log a call, viewing, or note about this lead…" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="input w-auto" aria-label="Follow-up date" />
          <button
            onClick={() =>
              run(() => addLeadNote(leadId, note, followUp), () => {
                setNote('');
                setFollowUp('');
              })
            }
            disabled={pending || !note.trim()}
            className="btn-primary"
          >
            Add note
          </button>
        </div>
      </div>
    </div>
  );
}
