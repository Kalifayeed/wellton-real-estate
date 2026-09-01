import { siteConfig } from '@/lib/config';

const WA_BASE = 'https://wa.me/';

// Build a WhatsApp deep link with a pre-filled, per-context message.
export function buildWhatsAppLink(message: string, number?: string): string {
  const n = (number || siteConfig.whatsapp).replace(/[^\d]/g, '');
  return `${WA_BASE}${n}?text=${encodeURIComponent(message)}`;
}

// URL-encode a phone for tel: links.
export function buildTelLink(phone?: string): string {
  return `tel:${(phone || siteConfig.phone).replace(/[^\d+]/g, '')}`;
}

export function propertySaleMessage(propertyTitle: string): string {
  return `Hello Wellton, I am interested in buying ${propertyTitle}. Please share more information.`;
}

export function propertyRentMessage(propertyTitle: string): string {
  return `Hello Wellton, I am interested in renting ${propertyTitle}. Please share more information and viewing availability.`;
}

export function genericMessage(intent = 'enquiry'): string {
  switch (intent) {
    case 'find-property':
      return 'Hello Wellton, I would like help finding a property. Please get in touch with me.';
    case 'find-rental':
      return 'Hello Wellton, I would like help finding a rental. Please get in touch with me.';
    case 'sell':
      return 'Hello Wellton, I would like to list my property. Please get in touch with me.';
    case 'manage':
      return 'Hello Wellton, I would like to discuss property management. Please get in touch with me.';
    case 'diaspora':
      return 'Hello Wellton, I am based abroad and would like help with property in Nairobi.';
    default:
      return 'Hello Wellton, I would like to speak with your team about your services.';
  }
}
