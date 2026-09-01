'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ComponentType } from 'react';
import { adminNav, agentNav, type AdminNavItem } from './AdminNav';
import { logout } from '@/actions/auth';
import {
  HomeIcon, BuildingIcon, MenuIcon, CloseIcon, MailIcon, ClockIcon,
  StarIcon, FileIcon, ShieldIcon, UserIcon,
} from '@/components/shared/Icons';

const iconMap: Record<AdminNavItem['icon'], ComponentType<{ className?: string }>> = {
  dashboard: HomeIcon,
  property: BuildingIcon,
  lead: MailIcon,
  viewing: ClockIcon,
  application: FileIcon,
  submission: StarIcon,
  insight: ShieldIcon,
  users: UserIcon,
};

function NavLinks({ items, active, onNavigate }: { items: AdminNavItem[]; active: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive = item.href === '/' ? active === '/' : active.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-700 text-white' : 'text-stone-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({
  user,
  items,
  title,
  children,
}: {
  user: { name: string; role: string };
  items: AdminNavItem[];
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-stone-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-stone-900 md:flex md:flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            {user.role === 'AGENT' ? 'Agent Workspace' : 'Administration'}
          </p>
          <NavLinks items={items} active={pathname} />
        </div>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-stone-400">{user.role}</p>
          <form action={logout}>
            <button type="submit" className="mt-2 text-xs text-stone-400 hover:text-white">Sign out</button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <h1 className="font-serif text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <form action={logout}>
              <button type="submit" className="text-xs text-stone-500">Sign out</button>
            </form>
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-800">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-hidden onClick={() => setOpen(false)} className="absolute inset-0 bg-stone-900/50" />
          <div className="absolute inset-y-0 left-0 w-72 bg-stone-900 p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-white">Menu</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center text-white">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <NavLinks items={items} active={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
