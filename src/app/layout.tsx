import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import Script from 'next/script';
import { siteConfig } from '@/lib/config';
import AppFrame from '@/components/layout/AppFrame';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Buy, Rent & Manage Property in Nairobi`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: '/wellton-mark.svg',
    shortcut: '/wellton-mark.svg',
    apple: '/wellton-mark.svg',
  },
  description:
    'Wellton Real Estate helps clients buy, sell, rent and manage residential and commercial properties in Nairobi, Kenya.',
  keywords: [
    'Nairobi real estate',
    'buy property Nairobi',
    'rent property Nairobi',
    'apartments for sale Nairobi',
    'houses for rent Nairobi',
    'property management Nairobi',
  ],
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_KE',
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Buy, Rent & Manage Property in Nairobi`,
    description:
      'Professional guidance, market knowledge and personalised service for property in Nairobi, Kenya.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <AppFrame>{children}</AppFrame>

        {siteConfig.analytics.googleAnalyticsId ? (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.googleAnalyticsId}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());gtag('config','${siteConfig.analytics.googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
