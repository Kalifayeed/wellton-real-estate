'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => Promise<{ ok: boolean; message: string }>;
  className?: string;
}

export default function StatusSelect({ value, options, onChange, className }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(value);

  const apply = (next: string) => {
    setCurrent(next);
    startTransition(async () => {
      const res = await onChange(next);
      if (res.ok && 'message' in res) {
        router.refresh();
      } else {
        setCurrent(value); // revert on failure
      }
    });
  };

  return (
    <select
      value={current}
      onChange={(e) => apply(e.target.value)}
      disabled={pending}
      className={`input w-auto ${className ?? ''}`}
    >
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
