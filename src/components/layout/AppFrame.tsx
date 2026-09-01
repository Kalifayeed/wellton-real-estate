'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import WhatsAppFloat from './WhatsAppFloat';

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInternal = pathname.startsWith('/admin') || pathname.startsWith('/agent');

  if (isInternal) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
