import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="font-serif text-7xl font-bold text-brand-700">404</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-stone-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-stone-600">
          We couldn&apos;t find the page you were looking for. It may have been moved or no longer exists.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-secondary">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
}
