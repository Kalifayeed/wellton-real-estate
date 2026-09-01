'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-semibold text-stone-900">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-stone-600">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-primary mt-6">Try again</button>
      </div>
    </div>
  );
}
