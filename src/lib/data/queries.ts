import { prisma } from '@/lib/prisma';
import { Prisma, type ListingPurpose, type PropertyType } from '@prisma/client';

export interface PropertyFilters {
  listingPurpose?: ListingPurpose;
  location?: string; // location slug
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  min?: number;
  max?: number;
  furnishing?: 'FURNISHED' | 'UNFURNISHED' | 'SERVICED';
  status?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  q?: string;
}

export const propertyInclude = {
  location: true,
  images: {
    orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }] as Prisma.PropertyImageOrderByWithRelationInput[],
    take: 8,
  },
  amenities: { include: { amenity: true } },
} satisfies Prisma.PropertyInclude;

export async function queryProperties(filters: PropertyFilters = {}) {
  const where: Prisma.PropertyWhereInput = { isPublished: true };

  if (filters.listingPurpose && filters.listingPurpose !== 'BOTH') {
    where.listingPurpose = { in: [filters.listingPurpose, 'BOTH'] };
  }

  if (filters.location) {
    where.location = { slug: filters.location };
  }

  if (filters.propertyType) {
    where.propertyType = filters.propertyType;
  }

  if (filters.bedrooms) {
    where.bedrooms = { gte: filters.bedrooms };
  }

  if (filters.bathrooms) {
    where.bathrooms = { gte: filters.bathrooms };
  }

  if (filters.furnishing) {
    where.furnishStatus = filters.furnishing;
  }

  if (filters.status) {
    where.propertyStatus = filters.status as Prisma.PropertyWhereInput['propertyStatus'];
  }

  // Price filters apply to the relevant listing purpose.
  const priceField = filters.listingPurpose === 'RENT' ? 'rentalPrice' : 'price';
  if (filters.min !== undefined || filters.max !== undefined) {
    const priceFilter = {
      ...(filters.min !== undefined ? { gte: filters.min } : {}),
      ...(filters.max !== undefined ? { lte: filters.max } : {}),
    };
    if (priceField === 'rentalPrice') {
      where.rentalPrice = priceFilter;
    } else {
      where.price = priceFilter;
    }
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
      { area: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput[] =
    filters.sort === 'price_asc'
      ? [{ price: 'asc' }]
      : filters.sort === 'price_desc'
        ? [{ price: 'desc' }]
        : [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

  const [items, total] = await Promise.all([
    prisma.property.findMany({ where, include: propertyInclude, orderBy }),
    prisma.property.count({ where }),
  ]);

  return { items, total };
}

export async function getFeaturedProperties(purpose: 'SALE' | 'RENT', limit = 6) {
  const where: Prisma.PropertyWhereInput = {
    isPublished: true,
    isFeatured: true,
    ...(purpose === 'SALE' ? { listingPurpose: { in: ['SALE', 'BOTH'] } } : { listingPurpose: { in: ['RENT', 'BOTH'] } }),
  };
  return prisma.property.findMany({
    where,
    include: propertyInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      location: true,
      images: { orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }] },
      videos: { orderBy: { sortOrder: 'asc' } },
      floorPlans: { orderBy: { sortOrder: 'asc' } },
      amenities: { include: { amenity: true } },
      owner: { select: { id: true, name: true, phone: true, email: true } },
    },
  });
}

export async function getRelatedProperties(property: { propertyType: PropertyType; id: string; locationId: string }, limit = 3) {
  return prisma.property.findMany({
    where: {
      isPublished: true,
      id: { not: property.id },
      OR: [{ propertyType: property.propertyType }, { locationId: property.locationId }],
    },
    include: propertyInclude,
    take: limit,
  });
}

export async function getLocations() {
  return prisma.location.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
}

export async function getAllLocations() {
  return prisma.location.findMany({ orderBy: { name: 'asc' } });
}
