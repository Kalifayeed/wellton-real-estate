'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { primaryNav } from '@/lib/navigation';
import { siteConfig } from '@/lib/config';
import { buildTelLink, buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { MenuIcon, CloseIcon, WhatsAppIcon, PhoneIcon } from '@/components/shared/Icons';

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <img src="/wellton-mark.svg" alt="Wellton Real Estate" className="h-11 w-11 shrink-0" />
      <span className="leading-tight">
        <span className="block text-xl font-black tracking-[-0.08em] text-brand-700 sm:text-2xl">
          WELLTON
        </span>
        <span className="block text-[0.6rem] font-bold uppercase tracking-[0.28em] text-stone-700">
          Real Estate
        </span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      {/* Top utility bar */}
      <div className="hidden border-b border-stone-200 bg-stone-900 text-stone-100 md:block">
        <div className="page-container flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-6">
            <a href={buildTelLink()} className="flex items-center gap-1.5 hover:text-white">
              <PhoneIcon className="h-3.5 w-3.5" /> {siteConfig.phoneDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
              {siteConfig.email}
            </a>
            <span className="hidden lg:inline text-stone-400">{siteConfig.officeHours}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={buildWhatsAppLink(genericMessage())}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('whatsapp_clicked', { location: 'topbar' })}
              className="flex items-center gap-1.5 text-white hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Brand />

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-brand-700'
                  : 'text-stone-700 hover:text-brand-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link href="/find-a-property" className="btn-secondary px-4 py-2">
            Find a Property
          </Link>
          <Link href="/find-a-rental" className="btn-primary px-4 py-2">
            Find a Rental
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={buildWhatsAppLink(genericMessage())}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            onClick={() => trackEvent('whatsapp_clicked', { location: 'mobile_header' })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-800"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-stone-900/40"
          />
          <nav
            aria-label="Mobile"
            className="absolute inset-y-0 right-0 w-full max-w-xs overflow-y-auto bg-white p-5 shadow-2xl animate-fade-in"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-serif text-lg font-semibold">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-800"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 space-y-2.5 border-t border-stone-200 pt-5">
              <Link href="/find-a-property" onClick={() => setOpen(false)} className="btn-secondary w-full">
                Find a Property
              </Link>
              <Link href="/find-a-rental" onClick={() => setOpen(false)} className="btn-primary w-full">
                Find a Rental
              </Link>
              <a
                href={buildTelLink()}
                className="btn-secondary w-full text-brand-700"
                onClick={() => trackEvent('phone_clicked', { location: 'mobile_menu' })}
              >
                <PhoneIcon className="h-4 w-4" /> Call us
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


