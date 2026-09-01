import Link from 'next/link';
import type { Metadata } from 'next';
import { getFeaturedProperties, queryProperties } from '@/lib/data/queries';
import HeroSearch from '@/components/home/HeroSearch';
import PropertyGrid from '@/components/property/PropertyGrid';
import { ArrowRightIcon, WhatsAppIcon, ShieldIcon, SearchIcon, BigHomeIcon, BuildingIcon, StarIcon, LocationIcon, GlobeIcon } from '@/components/shared/Icons';
import { buildWhatsAppLink, genericMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buy, Rent & Manage Property in Nairobi',
  description:
    'Wellton Real Estate helps you buy, sell, rent and manage residential and commercial property in Nairobi. Search apartments, houses, townhouses and investment opportunities.',
};

const categories = [
  { label: 'Apartments for Sale', href: '/properties?purpose=SALE&type=APARTMENT' },
  { label: 'Apartments for Rent', href: '/properties?purpose=RENT&type=APARTMENT' },
  { label: 'Houses for Sale', href: '/properties?purpose=SALE&type=HOUSE' },
  { label: 'Houses for Rent', href: '/properties?purpose=RENT&type=HOUSE' },
  { label: 'Townhouses', href: '/properties?type=TOWNHOUSE' },
  { label: 'Off-Plan Projects', href: '/properties?type=OFF_PLAN_DEVELOPMENT' },
  { label: 'Completed Projects', href: '/properties?type=COMPLETED_DEVELOPMENT' },
  { label: 'Investment Opportunities', href: '/properties?type=INVESTMENT' },
  { label: 'Furnished Rentals', href: '/rent?furnishing=FURNISHED' },
  { label: 'Commercial Rentals', href: '/properties?purpose=RENT&type=COMMERCIAL' },
];

export default async function HomePage() {
  const [featuredSale, featuredRent] = await Promise.all([
    getFeaturedProperties('SALE', 6),
    getFeaturedProperties('RENT', 6),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative page-container grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="heading-kicker !text-brand-300">Nairobi Real Estate</p>
            <h1 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Find Your Next Home, Rental, or Investment in Nairobi
            </h1>
            <p className="mt-5 max-w-lg text-lg text-brand-100">
              Buy, sell, rent and manage residential and commercial property with professional
              guidance, market knowledge and personalised service.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/properties" className="btn-primary">
                Browse Properties <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={buildWhatsAppLink(genericMessage())}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
          <div className="lg:justify-self-end">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-tight">
        <div className="page-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="heading-kicker">Explore</p>
              <h2 className="font-serif text-3xl font-semibold">Popular Property Categories</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group flex items-center gap-2.5 rounded-card border border-stone-200 bg-white px-4 py-3.5 text-sm font-medium text-stone-800 transition-all hover:border-brand-600 hover:text-brand-800 hover:shadow-card"
              >
                <BuildingIcon className="h-5 w-5 shrink-0 text-brand-600" />
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured for sale */}
      <section className="section">
        <div className="page-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="heading-kicker">Featured</p>
              <h2 className="font-serif text-3xl font-semibold">Properties for Sale</h2>
            </div>
            <Link href="/buy" className="link inline-flex items-center gap-1 text-sm font-semibold">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <PropertyGrid properties={featuredSale} />
        </div>
      </section>

      {/* Featured for rent */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="heading-kicker">Featured</p>
              <h2 className="font-serif text-3xl font-semibold">Rental Properties</h2>
            </div>
            <Link href="/rent" className="link inline-flex items-center gap-1 text-sm font-semibold">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <PropertyGrid properties={featuredRent} />
        </div>
      </section>

      {/* Why Wellton */}
      <section className="section bg-brand-950 text-white">
        <div className="page-container">
          <div className="mb-12 max-w-2xl">
            <p className="heading-kicker !text-brand-300">Why Wellton</p>
            <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              Professional guidance, market knowledge and personalised service
            </h2>
            <p className="mt-4 text-brand-100">
              Whether you are buying, renting, investing or managing a property, we connect you with
              suitable homes, rental opportunities and property investments in Nairobi and beyond.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: 'Professional Guidance', d: "Experienced advice at every stage of your property journey.", i: ShieldIcon },
              { t: 'Market Knowledge', d: "Local insight into Nairobi's best areas, pricing and opportunities.", i: LocationIcon },
              { t: 'Personalised Service', d: "Tailored property matching based on your specific needs.", i: StarIcon },
              { t: 'Property Selection', d: "A curated portfolio of residential and commercial listings.", i: BigHomeIcon },
              { t: 'Rental Assistance', d: "Help finding, applying for and securing the right rental.", i: SearchIcon },
              { t: 'Diaspora Support', d: "Remote search, virtual viewings and property management abroad.", i: GlobeIcon },
            ].map((f) => (
              <div key={f.t} className="rounded-card border border-white/10 bg-white/5 p-6">
                <f.i className="h-7 w-7 text-brand-300" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-white">{f.t}</h3>
                <p className="mt-2 text-sm text-brand-100">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client-service CTAs */}
      <section className="section">
        <div className="page-container">
          <div className="grid gap-6 lg:grid-cols-3">
            <a href="/find-a-property" className="group flex flex-col justify-between rounded-card bg-brand-700 p-7 text-white shadow-card transition-transform hover:-translate-y-0.5">
              <div>
                <p className="heading-kicker !text-brand-200">Buying or Investing</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-white">Find Me a Property</h3>
                <p className="mt-3 text-sm text-brand-100">
                  Tell us what you&apos;re looking for and we&apos;ll match you with the right property.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                Start a search <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a href="/find-a-rental" className="group flex flex-col justify-between rounded-card bg-gold-600 p-7 text-white shadow-card transition-transform hover:-translate-y-0.5">
              <div>
                <p className="heading-kicker !text-gold-100">Renting</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-white">Find a Rental</h3>
                <p className="mt-3 text-sm text-gold-50">
                  From long-term rentals to furnished apartments, let us help you find your next home.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                Find a rental <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a href="/sell-your-property" className="group flex flex-col justify-between rounded-card bg-stone-900 p-7 text-white shadow-card transition-transform hover:-translate-y-0.5">
              <div>
                <p className="heading-kicker !text-stone-400">Owner or Landlord</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-white">List Your Property</h3>
                <p className="mt-3 text-sm text-stone-300">
                  Sell or rent out your property with Wellton — from valuation to onboarding.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                List with us <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-card bg-[#25D366] px-7 py-6 text-white sm:flex-row">
            <div>
              <h3 className="font-serif text-xl font-semibold">Prefer to chat right away?</h3>
              <p className="text-sm text-white/90">Message the Wellton team on WhatsApp for property advice and quick answers.</p>
            </div>
            <a
              href={buildWhatsAppLink(genericMessage())}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#1fb457] hover:bg-stone-50"
            >
              <WhatsAppIcon className="h-5 w-5" /> Start a WhatsApp Chat
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


