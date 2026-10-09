// ------------------------------------------------------------------
// Wellton Real Estate — site configuration
//
// Public business details. Hosting environment values can override these.
// ------------------------------------------------------------------

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Wellton Real Estate',
  tagline:
    'Find Your Next Home, Rental, or Investment in Nairobi',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://welltonproperties.co.ke',

  phone: process.env.NEXT_PUBLIC_PHONE || '+254723811626',
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE || '+254 723 811 626',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '254723811626',
  email: process.env.NEXT_PUBLIC_EMAIL || 'Welltonrealestate@gmail.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Nairobi, Kenya',
  officeHours: 'Mon – Sat, 9:00 AM – 6:00 PM',
  viewingHours: 'Viewings by appointment, 7 days a week',

  // Keep analytics provider keys as empty placeholders until configured.
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  },
};

export type SiteConfig = typeof siteConfig;
