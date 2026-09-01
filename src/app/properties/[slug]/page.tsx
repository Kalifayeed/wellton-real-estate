import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyBySlug, getRelatedProperties } from '@/lib/data/queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { labelOf } from '@/lib/constants';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyGrid from '@/components/property/PropertyGrid';
import MapEmbed from '@/components/property/MapEmbed';
import InquiryForm from '@/components/forms/InquiryForm';
import RentalApplicationForm from '@/components/forms/RentalApplicationForm';
import { buildWhatsAppLink, propertySaleMessage, propertyRentMessage, buildTelLink } from '@/lib/whatsapp';
import {
  BedIcon,
  BathIcon,
  RulerIcon,
  LocationIcon,
  WhatsAppIcon,
  PhoneIcon,
  ClockIcon,
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
} from '@/components/shared/Icons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  const price = property.listingPurpose === 'RENT' ? property.rentalPrice : property.price;
  return {
    title: `${property.title} — ${property.location.name}`,
    description:
      property.description?.slice(0, 160) ||
      `${property.title} in ${property.location.name}, ${property.area || 'Nairobi'}. ${property.bedrooms ?? ''} bed, ${property.bathrooms ?? ''} bath. Contact Wellton Real Estate.`,
    openGraph: {
      title: `${property.title} — ${property.location.name}`,
      description: property.description?.slice(0, 160),
      images: property.images[0]?.url ? [{ url: property.images[0].url }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property || !property.isPublished) notFound();

  const related = await getRelatedProperties(property);
  const isRental = property.listingPurpose === 'RENT' || property.listingPurpose === 'BOTH';
  const price = isRental ? property.rentalPrice : property.price;
  const waMessage = isRental ? propertyRentMessage(property.title) : propertySaleMessage(property.title);

  const priceJsonLd = price ? { '@type': 'Offer', price: price.toNumber(), priceCurrency: 'KES' } : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/properties/${property.slug}`,
    image: property.images[0]?.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location.name,
      addressCountry: 'KE',
    },
    ...(priceJsonLd ? { offers: priceJsonLd } : {}),
  };


  return (
    <div className="page-container py-8">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <nav className="mb-5 text-sm text-stone-500" aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/properties" className="hover:text-brand-700">Properties</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={isRental ? '/rent' : '/buy'} className="hover:text-brand-700">{isRental ? 'Rent' : 'Buy'}</Link></li>
          <li aria-hidden>/</li>
          <li className="text-stone-700">{property.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {property.listingPurpose === 'SALE' && <span className="badge bg-brand-700 text-white">For Sale</span>}
            {property.listingPurpose === 'RENT' && <span className="badge bg-gold-600 text-white">For Rent</span>}
            {property.listingPurpose === 'BOTH' && <span className="badge bg-brand-700 text-white">Sale & Rent</span>}
            <span className="badge bg-stone-100 text-stone-700">{labelOf('propertyStatus', property.propertyStatus)}</span>
            {property.isFeatured && (
              <span className="badge bg-gold-500 text-white"><StarIcon className="h-3 w-3" /> Featured</span>
            )}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-stone-600">
            <LocationIcon className="h-4 w-4 text-brand-600" />
            {property.location.name}
            {property.area ? ` · ${property.area}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-500">{isRental ? 'Rental price' : 'Asking price'}</p>
          <p className="font-serif text-3xl font-bold text-brand-800">
            {price ? formatCurrency(price.toNumber()) : 'Price on request'}
          </p>
          {isRental && property.rentalFrequency && (
            <p className="text-sm text-stone-500">per {labelOf('rentalFrequency', property.rentalFrequency)}</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-7">
        <PropertyGallery
          images={property.images.map((img) => ({ url: img.url, altText: img.altText }))}
          title={property.title}
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Main content */}
        <div>
          {/* Key facts */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-stone-200 sm:grid-cols-4">
            {[
              property.bedrooms != null ? { k: 'Bedrooms', v: String(property.bedrooms), Icon: BedIcon } : null,
              property.bathrooms != null ? { k: 'Bathrooms', v: String(property.bathrooms), Icon: BathIcon } : null,
              property.sizeSqm != null ? { k: 'Size', v: `${property.sizeSqm} m²`, Icon: RulerIcon } : null,
              property.furnishStatus ? { k: 'Furnishing', v: labelOf('furnishStatus', property.furnishStatus), Icon: ClockIcon } : null,
            ]
              .filter(Boolean)
              .map((f) => f as { k: string; v: string; Icon: typeof BedIcon })
              .map(({ k, v, Icon }) => (
                <div key={k} className="bg-white p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-brand-600" />
                  <p className="mt-2 text-lg font-semibold text-stone-900">{v}</p>
                  <p className="text-xs text-stone-500">{k}</p>
                </div>
              ))}
          </div>

          {/* Description */}
          {property.description && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-semibold">About this property</h2>
              <p className="prose-content mt-3 whitespace-pre-line">{property.description}</p>
            </section>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-semibold">Features &amp; Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((pa) => (
                  <li key={pa.amenity.id} className="flex items-center gap-2 text-sm text-stone-700">
                    <CheckIcon className="h-4 w-4 text-brand-600" /> {pa.amenity.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rental details */}
          {isRental && (
            <section className="mt-10 rounded-card border border-stone-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Rental Details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {property.securityDeposit && <Detail k="Security deposit" v={formatCurrency(property.securityDeposit.toNumber())} />}
                {property.serviceCharge && <Detail k="Service charge" v={formatCurrency(property.serviceCharge.toNumber())} />}
                {property.leaseTerms && <Detail k="Lease terms" v={property.leaseTerms} />}
                {property.minRentalPeriod && <Detail k="Minimum rental period" v={property.minRentalPeriod} />}
                {property.availabilityDate && <Detail k="Available from" v={formatDate(property.availabilityDate)} />}
                {property.tenantRequirement && <Detail k="Tenant requirements" v={property.tenantRequirement} />}
                {property.petPolicy && <Detail k="Pet policy" v={property.petPolicy} />}
                {property.utilitiesIncluded && <Detail k="Utilities included" v={property.utilitiesIncluded} />}
                {property.utilities && <Detail k="Utilities" v={property.utilities} />}
                {property.managedByWellton && <Detail k="Managed by Wellton" v="Yes" />}
              </dl>
            </section>
          )}
          {/* Media: videos, floor plans, virtual tour */}
          {(property.videos.length > 0 || property.floorPlans.length > 0 || property.virtualTourUrl) && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl font-semibold">Media</h2>
              {property.virtualTourUrl && (
                <div className="mt-4 overflow-hidden rounded-card border border-stone-200">
                  <iframe
                    title={`Virtual tour of ${property.title}`}
                    src={property.virtualTourUrl}
                    className="h-[420px] w-full"
                    allow="fullscreen"
                  />
                </div>
              )}
              {property.videos.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {property.videos.map((v) => (
                    <video key={v.id} src={v.url} controls className="w-full rounded-card border border-stone-200" />
                  ))}
                </div>
              )}
              {property.floorPlans.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {property.floorPlans.map((fp) => (
                    <figure key={fp.id}>
                      <img src={fp.url} alt={`Floor plan ${fp.label || ''}`} className="w-full rounded-card border border-stone-200" />
                      {fp.label && <figcaption className="mt-2 text-xs text-stone-500">{fp.label}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Map */}
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-semibold">Location</h2>
            <MapEmbed address={`${property.location.name}${property.area ? ', ' + property.area : ''}, Nairobi, Kenya`} mapEmbedUrl={property.mapEmbedUrl} />
          </section>

          {/* Sale extras */}
          {!isRental && (
            <section className="mt-10 grid gap-4 sm:grid-cols-2">
              {property.paymentPlan && <InfoBlock label="Payment plan" value={property.paymentPlan} />}
              {property.completionDate && <InfoBlock label="Completion date" value={formatDate(property.completionDate)} />}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-stone-200 bg-white p-6">
            <div className="mb-4 grid grid-cols-2 gap-2.5">
              <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a href={buildTelLink()} className="btn-secondary">
                <PhoneIcon className="h-4 w-4" /> Call
              </a>
            </div>
            <div className="rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
              <p className="font-semibold text-stone-900">Have a question about this property?</p>
              <p className="mt-1">Send an enquiry and our team will contact you promptly.</p>
            </div>
            <div className="mt-5 border-t border-stone-100 pt-5">
              <h3 className="mb-3 font-serif text-lg font-semibold">Enquire about this property</h3>
              <InquiryForm propertyId={property.id} propertyTitle={property.title} purpose={property.listingPurpose} />
            </div>
          </div>

          {isRental && (
            <div className="mt-6 rounded-card bg-brand-950 p-6 text-white">
              <h3 className="font-serif text-xl font-semibold text-white">Rental Application</h3>
              <p className="mt-2 text-sm text-brand-100">
                Ready to apply? Complete our online rental application to submit your details securely.
              </p>
              <details className="mt-4">
                <summary className="btn-primary w-full cursor-pointer bg-white text-brand-800 hover:bg-stone-50">
                  Apply to rent
                </summary>
                <div className="mt-4 bg-white p-4 text-stone-800 rounded-card">
                  <RentalApplicationForm propertyId={property.id} propertyTitle={property.title} />
                </div>
              </details>
            </div>
          )}
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="heading-kicker">You may also like</p>
              <h2 className="font-serif text-2xl font-semibold">Similar Properties</h2>
            </div>
            <Link href={isRental ? '/rent' : '/buy'} className="link inline-flex items-center gap-1 text-sm font-semibold">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <PropertyGrid properties={related} />
        </section>
      )}
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{k}</dt>
      <dd className="mt-0.5 text-sm text-stone-800">{v}</dd>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-stone-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-sm text-stone-800">{value}</p>
    </div>
  );
}
