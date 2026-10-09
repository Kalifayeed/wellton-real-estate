'use client';

import { useState, type ComponentProps } from 'react';
import { uploadFormError } from '@/lib/upload-limits';

export default function UploadForm({ children, ...props }: ComponentProps<'form'>) {
  const [error, setError] = useState<string | null>(null);
  return (
    <form {...props} onSubmit={(event) => {
      const message = uploadFormError(new FormData(event.currentTarget));
      setError(message);
      if (message) event.preventDefault();
    }}>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {children}
      <p className="text-sm text-stone-500">Combined attachments: up to 4 MB per submission.</p>
    </form>
  );
}
