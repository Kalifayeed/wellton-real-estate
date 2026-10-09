'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth';
import { savePublicImage } from '@/lib/storage';
import { uploadFormError } from '@/lib/upload-limits';
import { slugify } from '@/lib/format';
import { logAudit } from '@/lib/audit';
import { fail, ok, type ActionState } from '../shared';

export async function createProperty(_: ActionState, formData: FormData): Promise<ActionState> {
  const uploadError = uploadFormError(formData);
  if (uploadError) return fail(uploadError);
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  const data = parsePropertyForm(formData);
  if (!data.title) return fail('Title is required.');
  if (!data.locationId) return fail('Location is required.');

  const imageUrls: string[] = [];
  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    try {
      const saved = await savePublicImage(file);
      imageUrls.push(saved.url);
    } catch {
      return fail('An image could not be uploaded. Please check the files and try again.');
    }
  }

  const amenities = formData.getAll('amenities').map(String);

  try {
    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        description: data.description,
        locationId: data.locationId,
        area: data.area,
        propertyType: data.propertyType,
        listingPurpose: data.listingPurpose,
        price: data.price,
        rentalPrice: data.rentalPrice,
        rentalFrequency: data.rentalFrequency,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sizeSqm: data.sizeSqm,
        furnishStatus: data.furnishStatus,
        propertyStatus: data.propertyStatus,
        availabilityDate: data.availabilityDate,
        completionDate: data.completionDate,
        leaseTerms: data.leaseTerms,
        minRentalPeriod: data.minRentalPeriod,
        paymentPlan: data.paymentPlan,
        securityDeposit: data.securityDeposit,
        serviceCharge: data.serviceCharge,
        tenantRequirement: data.tenantRequirement,
        petPolicy: data.petPolicy,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        virtualTourUrl: data.virtualTourUrl,
        ownerId: session.sub,
        images:
          imageUrls.length > 0
            ? { create: imageUrls.map((url, i) => ({ url, isCover: i === 0, sortOrder: i })) }
            : undefined,
        amenities: amenities.length > 0 ? { create: amenities.map((amenityId) => ({ amenityId })) } : undefined,
      },
    });

    await logAudit({ userId: session.sub, action: 'PROPERTY_CREATED', entity: 'Property', entityId: property.id });
    revalidatePath('/admin/properties');
    revalidatePath('/');
    return ok('Property created.');
  } catch (e) {
    console.error('[createProperty]', e);
    return fail('Could not create property.');
  }
}

export async function updateProperty(_: ActionState, formData: FormData): Promise<ActionState> {
  const uploadError = uploadFormError(formData);
  if (uploadError) return fail(uploadError);
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  const id = String(formData.get('id') || '');
  const data = parsePropertyForm(formData);
  if (!id) return fail('Missing property id.');

  const imageUrls: string[] = [];
  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    try {
      const saved = await savePublicImage(file);
      imageUrls.push(saved.url);
    } catch {
      return fail('An image could not be uploaded. Please check the files and try again.');
    }
  }

  const amenities = formData.getAll('amenities').map(String);

  try {
    await prisma.$transaction([
      prisma.property.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug || slugify(data.title),
          description: data.description,
          locationId: data.locationId,
          area: data.area,
          propertyType: data.propertyType,
          listingPurpose: data.listingPurpose,
          price: data.price,
          rentalPrice: data.rentalPrice,
          rentalFrequency: data.rentalFrequency,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          sizeSqm: data.sizeSqm,
          furnishStatus: data.furnishStatus,
          propertyStatus: data.propertyStatus,
          availabilityDate: data.availabilityDate,
          completionDate: data.completionDate,
          leaseTerms: data.leaseTerms,
          minRentalPeriod: data.minRentalPeriod,
          paymentPlan: data.paymentPlan,
          securityDeposit: data.securityDeposit,
          serviceCharge: data.serviceCharge,
          tenantRequirement: data.tenantRequirement,
          petPolicy: data.petPolicy,
          isFeatured: data.isFeatured,
          isPublished: data.isPublished,
          virtualTourUrl: data.virtualTourUrl,
          amenities:
            amenities.length > 0
              ? { deleteMany: {}, create: amenities.map((amenityId) => ({ amenityId })) }
              : { deleteMany: {} },
        },
      }),
      ...(imageUrls.length > 0
        ? [prisma.propertyImage.createMany({ data: imageUrls.map((url, i) => ({ propertyId: id, url, isCover: i === 0, sortOrder: i })) })]
        : []),
    ]);

    await logAudit({ userId: session.sub, action: 'PROPERTY_UPDATED', entity: 'Property', entityId: id });
    revalidatePath('/admin/properties');
    revalidatePath('/');
    return ok('Property updated.');
  } catch (e) {
    console.error('[updateProperty]', e);
    return fail('Could not update property.');
  }
}

export async function deleteProperty(id: string): Promise<void> {
  const session = await requireRoles(['ADMIN']);
  await prisma.property.delete({ where: { id } });
  await logAudit({ userId: session.sub, action: 'PROPERTY_DELETED', entity: 'Property', entityId: id });
  revalidatePath('/admin/properties');
  revalidatePath('/');
}

export async function togglePublish(id: string): Promise<void> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  const property = await prisma.property.findUnique({ where: { id }, select: { isPublished: true } });
  if (!property) return;
  await prisma.property.update({ where: { id }, data: { isPublished: !property.isPublished } });
  await logAudit({
    userId: session.sub,
    action: property.isPublished ? 'PROPERTY_UNPUBLISHED' : 'PROPERTY_PUBLISHED',
    entity: 'Property',
    entityId: id,
  });
  revalidatePath('/admin/properties');
  revalidatePath('/');
}

export async function toggleFeatured(id: string): Promise<void> {
  await requireRoles(['ADMIN', 'MANAGER']);
  const property = await prisma.property.findUnique({ where: { id }, select: { isFeatured: true } });
  if (!property) return;
  await prisma.property.update({ where: { id }, data: { isFeatured: !property.isFeatured } });
  revalidatePath('/admin/properties');
  revalidatePath('/');
}

export async function setPropertyStatus(id: string, status: string): Promise<void> {
  const session = await requireRoles(['ADMIN', 'MANAGER']);
  await prisma.property.update({ where: { id }, data: { propertyStatus: status as never } });
  await logAudit({ userId: session.sub, action: 'PROPERTY_UPDATED', entity: 'Property', entityId: id, metadata: { status } });
  revalidatePath('/admin/properties');
  revalidatePath('/');
}

function num(v: FormDataEntryValue | null): number | undefined {
  if (v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function parsePropertyForm(formData: FormData) {
  const str = (k: string) => {
    const v = formData.get(k);
    return v === null ? '' : String(v);
  };
  const dateOrUndef = (k: string) => {
    const v = str(k);
    return v ? new Date(v) : undefined;
  };
  const bool = (k: string) => formData.get(k) === 'on';
  const enumOrUndef = (k: string) => {
    const v = str(k);
    return v || undefined;
  };

  return {
    title: str('title'),
    slug: str('slug'),
    description: str('description') || undefined,
    locationId: str('locationId'),
    area: enumOrUndef('area'),
    propertyType: enumOrUndef('propertyType') as never,
    listingPurpose: enumOrUndef('listingPurpose') as never,
    price: num(formData.get('price')),
    rentalPrice: num(formData.get('rentalPrice')),
    rentalFrequency: enumOrUndef('rentalFrequency') as never,
    bedrooms: num(formData.get('bedrooms')),
    bathrooms: num(formData.get('bathrooms')),
    sizeSqm: num(formData.get('sizeSqm')),
    furnishStatus: enumOrUndef('furnishStatus') as never,
    propertyStatus: enumOrUndef('propertyStatus') as never,
    availabilityDate: dateOrUndef('availabilityDate'),
    completionDate: dateOrUndef('completionDate'),
    leaseTerms: enumOrUndef('leaseTerms'),
    minRentalPeriod: enumOrUndef('minRentalPeriod'),
    paymentPlan: enumOrUndef('paymentPlan'),
    securityDeposit: num(formData.get('securityDeposit')),
    serviceCharge: num(formData.get('serviceCharge')),
    tenantRequirement: enumOrUndef('tenantRequirement'),
    petPolicy: enumOrUndef('petPolicy'),
    isFeatured: bool('isFeatured'),
    isPublished: bool('isPublished'),
    virtualTourUrl: enumOrUndef('virtualTourUrl'),
  };
}

