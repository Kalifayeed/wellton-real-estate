'use client';

// Centralised analytics/event abstraction. Swap the provider (GA, Meta
// Pixel, etc.) here without touching call sites. Tracking is best-effort
// and never breaks the UI.

export type AnalyticsEvent =
  | 'property_search'
  | 'property_viewed'
  | 'whatsapp_clicked'
  | 'phone_clicked'
  | 'inquiry_submitted'
  | 'viewing_requested'
  | 'rental_application_started'
  | 'rental_application_submitted'
  | 'find_property_submitted'
  | 'find_rental_submitted'
  | 'sell_property_submitted'
  | 'property_management_submitted';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return;

  // Google Analytics (gtag.js)
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, properties);
  }

  // Meta Pixel (dedicated event names below)
  if (typeof window.fbq === 'function') {
    const metaEventMap: Partial<Record<AnalyticsEvent, string>> = {
      inquiry_submitted: 'Lead',
      rental_application_submitted: 'Lead',
      property_viewed: 'ViewContent',
      whatsapp_clicked: 'Contact',
      phone_clicked: 'Contact',
      property_search: 'Search',
    };
    const metaEvent = metaEventMap[event];
    if (metaEvent) window.fbq('track', metaEvent, properties);
  }

  // Fallback: push to a generic dataLayer.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...properties });
}

export function initAnalytics(): void {
  // Provider init scripts go here once keys are supplied.
  // The scripts themselves live in the layout head component.
}
