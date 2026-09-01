import Image from 'next/image';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { propertyInclude } from '@/lib/data/queries';
import { formatCurrency, formatCurrencyCompact } from '@/lib/format';
import { labelOf, CLOSED_STATUSES } from '@/lib/constants';
import { buildWhatsAppLink, propertySaleMessage, propertyRentMessage } from '@/lib/whatsapp';
import {
  BedIcon,
  BathIcon,
  RulerIcon,
  LocationIcon,
  WhatsAppIcon,
  StarIcon,
} from '@/components/shared/Icons';

export type PropertyCardData = Prisma.PropertyGetPayload<{ include: typeof propertyInclude }>;

function SaleLabel() {
  return (
    <span className="badge bg-brand-700 text-white">For Sale</span>
  );
}

function RentLabel() {
  return (
    <span className="badge bg-gold-600 text-white">For Rent</span>
  );
}

function BothLabel() {
  return (
    <span className="badge bg-brand-700 text-white">Sale & Rent</span>
  );
}

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = property.images.find((img) => img.isCover) ?? property.images[0];
  const purpose = property.listingPurpose;
  const isClosed = CLOSED_STATUSES.includes(property.propertyStatus);
  const price =
    purpose === 'RENT' || purpose === 'BOTH'
      ? property.rentalPrice
      : property.price;
  const freqLabel = property.rentalFrequency
    ? ` / ${labelOf('rentalFrequency', property.rentalFrequency)}`
    : '';
  const waMessage =
    purpose === 'RENT'
      ? propertyRentMessage(property.title)
      : propertySaleMessage(property.title);

  return (
    <article className="group overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            No image
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {purpose === 'SALE' && <SaleLabel />}
          {purpose === 'RENT' && <RentLabel />}
          {purpose === 'BOTH' && <BothLabel />}
        </div>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {property.isFeatured && (
            <span className="badge bg-gold-500 text-white">
              <StarIcon className="h-3 w-3" /> Featured
            </span>
          )}
        </div>

        {isClosed && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/55">
            <span className="rounded-md bg-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-stone-900">
              {labelOf('propertyStatus', property.propertyStatus)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-stone-500">
          <LocationIcon className="h-3.5 w-3.5 text-brand-600" />
          {property.location.name}
          {property.area ? ` · ${property.area}` : ''}
        </div>
        <h3 className="line-clamp-1 font-serif text-lg font-semibold text-stone-900">
          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold text-brand-800">
            {price ? formatCurrencyCompact(price.toNumber()) : 'Price on request'}
          </span>
          {price && purpose !== 'SALE' && (
            <span className="text-sm text-stone-500">{freqLabel}</span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedIcon className="h-4 w-4 text-stone-400" /> {property.bedrooms} bd
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <BathIcon className="h-4 w-4 text-stone-400" /> {property.bathrooms} ba
            </span>
          )}
          {property.sizeSqm != null && (
            <span className="flex items-center gap-1">
              <RulerIcon className="h-4 w-4 text-stone-400" /> {property.sizeSqm} m²
            </span>
          )}
          {property.furnishStatus && (
            <span className="text-stone-500">{labelOf('furnishStatus', property.furnishStatus)}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3">
          <Link href={`/properties/${property.slug}`} className="link text-sm font-semibold">
            View Details
          </Link>
          <a
            href={buildWhatsAppLink(waMessage)}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp about ${property.title}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1fb457]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
