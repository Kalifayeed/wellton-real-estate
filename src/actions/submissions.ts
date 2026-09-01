'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ownerSubmissionSchema, rentalApplicationSchema } from '@/lib/validation';
import { fail, ok, zodToFieldErrors, type ActionState } from './shared';
import { savePrivateDocument, savePublicImage } from '@/lib/storage';

function isSpam(formData: FormData): boolean {
  const honeypot = formData.get('website');
  if (honeypot && String(honeypot).length > 0) return true;
  return false;
}

export async function submitOwnerSubmission(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = ownerSubmissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  // Handle uploaded images (public media) — best effort, never blocks submission.
  const imageUrls: string[] = [];
  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    try {
      const saved = await savePublicImage(file);
      imageUrls.push(saved.url);
    } catch {
      // skip invalid image
    }
  }

  try {
    const submission = await prisma.ownerSubmission.create({
      data: {
        ownerName: data.ownerName,
        phone: data.phone,
        email: data.email || undefined,
        location: data.location || undefined,
        propertyType: (data.propertyType as never) || undefined,
        bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
        askingPrice: data.askingPrice ? Number(data.askingPrice) : undefined,
        rentalPrice: data.rentalPrice ? Number(data.rentalPrice) : undefined,
        furnishStatus: data.furnishStatus as never || undefined,
        availability: data.availability || undefined,
        description: data.description,
        serviceType: data.serviceType as never || undefined,
        contactMethod: data.contactMethod as never || undefined,
        images: imageUrls as Prisma.InputJsonValue,
        status: 'SUBMITTED',
      },
    });

    await logAnalytics('sell_property_submitted', {});
    return ok(
      'Thank you! Your property has been submitted and will be reviewed by our team. We will contact you within 1–2 business days.',
      { entityId: submission.id }
    );
  } catch (e) {
    console.error('[submitOwnerSubmission]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

export async function submitRentalApplication(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = rentalApplicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  const propertyId = String(formData.get('propertyId') || '');
  if (!propertyId) return fail('Missing property reference. Please go back and try again.');

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, title: true, slug: true },
  });
  if (!property) return fail('Property not found.');

  try {
    const application = await prisma.rentalApplication.create({
      data: {
        propertyId,
        applicantName: data.name,
        phone: data.phone,
        email: data.email || undefined,
        currentAddress: data.currentAddress || undefined,
        preferredMoveIn: data.moveInDate ? new Date(data.moveInDate) : undefined,
        leaseDuration: data.leaseDuration || undefined,
        employmentStatus: data.employmentStatus || undefined,
        employer: data.employer || undefined,
        incomeRange: data.incomeRange || undefined,
        occupants: data.occupants ? Number(data.occupants) : undefined,
        references: data.references || undefined,
        additionalInfo: data.additionalInfo || undefined,
      },
    });

    // Create/associate a lead representing this application.
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        propertyId,
        listingPurpose: 'RENT',
        source: 'WEBSITE',
        status: 'APPLICATION_SUBMITTED',
        notes: `Rental application received for ${property.title}.`,
        applications: { connect: { id: application.id } },
      },
    });

    // Handle uploaded supporting documents (private storage).
    const docs = formData.getAll('documents').filter((f): f is File => f instanceof File && f.size > 0);
    for (const doc of docs) {
      try {
        const saved = await savePrivateDocument(doc, application.id);
        await prisma.applicationDocument.create({
          data: {
            applicationId: application.id,
            fileName: doc.name,
            storedPath: saved.storedPath,
            mimeType: saved.mimeType,
            sizeBytes: saved.sizeBytes,
          },
        });
      } catch {
        // skip invalid document
      }
    }

    await logAnalytics('rental_application_submitted', { propertyId });
    return ok(
      'Thank you! Your rental application has been submitted. Our team will review it and contact you about next steps.',
      { entityId: application.id, leadId: lead.id }
    );
  } catch (e) {
    console.error('[submitRentalApplication]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

async function logAnalytics(event: string, props: Record<string, unknown>) {
  try {
    await prisma.analyticEvent.create({ data: { event, properties: props as Prisma.InputJsonValue } });
  } catch {
    // best effort
  }
}
