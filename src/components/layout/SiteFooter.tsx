import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { primaryNav, quickLinks } from '@/lib/navigation';
import { buildTelLink, buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { PhoneIcon, MailIcon, LocationIcon, WhatsAppIcon } from '@/components/shared/Icons';

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="page-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center justify-start">
            <img src="/wellton-logo.svg" alt="Wellton Real Estate" className="h-20 w-auto" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-stone-400">
            We help clients buy, sell, rent and manage properties through professional guidance,
            market knowledge and personalised service in Nairobi and beyond.
          </p>
          <a
            href={buildWhatsAppLink(genericMessage())}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1fb457]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-stone-400 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-stone-400 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-stone-400">
            <li>
              <a href={buildTelLink()} className="flex items-center gap-2.5 hover:text-white">
                <PhoneIcon className="h-4 w-4 text-brand-400" /> {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 hover:text-white">
                <MailIcon className="h-4 w-4 text-brand-400" /> {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {siteConfig.address}
            </li>
            <li className="pt-1 text-xs text-stone-500">
              {siteConfig.officeHours}
              <br />
              {siteConfig.viewingHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col items-center justify-between gap-2 py-5 text-xs text-stone-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="text-stone-600">Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
}
