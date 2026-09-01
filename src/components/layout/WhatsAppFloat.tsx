'use client';

import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/shared/Icons';

export default function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppLink(genericMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Wellton on WhatsApp"
      onClick={() => trackEvent('whatsapp_clicked', { location: 'floating_button' })}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
