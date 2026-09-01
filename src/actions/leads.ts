'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { inquirySchema, findPropertySchema, findRentalSchema, contactSchema, propertyManagementSchema } from '@/lib/validation';
import { fail, ok, zodToFieldErrors, type ActionState } from './shared';
import { toISO } from '@/lib/format';

// Honeypot + simple spam guard. Returns true if it looks like spam.
function isSpam(formData: FormData): boolean {
  const honeypot = formData.get('website');
  if (honeypot && String(honeypot).length > 0) return true;
  return false;
}

export async function submitInquiry(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });

  const data = parsed.data;
  const propertyId = String(formData.get('propertyId') || '');
  const purpose = String(formData.get('purpose') || '');

  let property = null;
  if (propertyId) {
    property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, slug: true },
    });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        propertyId: propertyId || undefined,
        listingPurpose: purpose ? (purpose as 'SALE' | 'RENT') : undefined,
        preferredMoveIn: data.viewingDate ? new Date(data.viewingDate) : undefined,
        source: 'WEBSITE',
        status: 'NEW',
        notes: data.message,
        activities: {
          create: {
            type: 'inquiry',
            note: `Inquiry: ${data.inquiryType}${property ? ` on ${property.title}` : ''}. ${data.message}`,
            followUpDate: data.viewingDate ? new Date(data.viewingDate) : undefined,
          },
        },
      },
    });

    if (data.inquiryType === 'SCHEDULE_VIEWING' || data.inquiryType === 'VIRTUAL_VIEWING') {
      await prisma.viewing.create({
        data: {
          propertyId: propertyId || 'pending',
          leadId: lead.id,
          scheduledAt: data.viewingDate ? new Date(data.viewingDate) : undefined,
          notes: `${data.name}${data.inquiryType === 'VIRTUAL_VIEWING' ? ' (virtual)' : ''}: ${data.message}`,
        },
      });
    }

    await logAnalytics('inquiry_submitted', { inquiryType: data.inquiryType });

    return ok('Thank you! Your enquiry has been received. Our team will contact you shortly.', {
      leadId: lead.id,
    });
  } catch (e) {
    console.error('[submitInquiry]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

export async function submitFindProperty(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = findPropertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        listingPurpose: data.listingPurpose as 'SALE' | 'RENT' | 'BOTH' | undefined,
        preferredLocation: data.preferredLocation || undefined,
        budget: data.budget ? Number(data.budget) : undefined,
        budgetFrequency: data.budgetFrequency as 'MONTHLY' | 'WEEKLY' | 'YEARLY' | undefined,
        preferredMoveIn: data.moveInDate ? new Date(data.moveInDate) : undefined,
        source: 'WEBSITE',
        status: 'NEW',
        notes: [
          data.currentCountry && `Country: ${data.currentCountry}`,
          data.propertyType && `Property type: ${data.propertyType}`,
          data.bedrooms && `Bedrooms: ${data.bedrooms}+`,
          data.bathrooms && `Bathrooms: ${data.bathrooms}+`,
          data.purpose && `Purpose: ${data.purpose}`,
          data.preferredStatus && `Status: ${data.preferredStatus}`,
          data.furnishStatus && `Furnishing: ${data.furnishStatus}`,
          data.requirements && `Requirements: ${data.requirements}`,
        ]
          .filter(Boolean)
          .join(' · '),
        activities: { create: { type: 'note', note: 'Submitted "Find Me a Property" request.' } },
      },
    });
    await logAnalytics('find_property_submitted', {});
    return ok('Thank you! We have received your property request and will match you with suitable properties.', {
      leadId: lead.id,
    });
  } catch (e) {
    console.error('[submitFindProperty]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

export async function submitFindRental(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = findRentalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        listingPurpose: 'RENT',
        preferredLocation: data.preferredLocation || undefined,
        budget: data.budget ? Number(data.budget) : undefined,
        budgetFrequency: 'MONTHLY',
        preferredMoveIn: data.moveInDate ? new Date(data.moveInDate) : undefined,
        source: 'WEBSITE',
        status: 'NEW',
        notes: [
          data.propertyType && `Property type: ${data.propertyType}`,
          data.bedrooms && `Bedrooms: ${data.bedrooms}+`,
          data.furnishStatus && `Furnishing: ${data.furnishStatus}`,
          data.rentalDuration && `Rental duration: ${data.rentalDuration}`,
          data.employmentInfo && `Employment: ${data.employmentInfo}`,
          data.requirements && `Requirements: ${data.requirements}`,
        ]
          .filter(Boolean)
          .join(' · '),
        activities: { create: { type: 'note', note: 'Submitted "Find a Rental" request.' } },
      },
    });
    await logAnalytics('find_rental_submitted', {});
    return ok('Thank you! We will contact you with suitable rental options.', { leadId: lead.id });
  } catch (e) {
    console.error('[submitFindRental]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

export async function submitPropertyManagement(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = propertyManagementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        listingPurpose: 'RENT',
        preferredLocation: data.propertyLocation || undefined,
        source: 'WEBSITE',
        status: 'NEW',
        notes: [
          data.propertyType && `Property type: ${data.propertyType}`,
          data.bedrooms && `Bedrooms: ${data.bedrooms}`,
          data.rentalPrice && `Rent: ${data.rentalPrice}`,
          data.furnishStatus && `Furnishing: ${data.furnishStatus}`,
          data.availability && `Availability: ${data.availability}`,
          data.serviceType && `Service: ${data.serviceType}`,
          data.message && `Message: ${data.message}`,
        ]
          .filter(Boolean)
          .join(' · '),
        activities: { create: { type: 'note', note: 'Property management inquiry.' } },
      },
    });
    await logAnalytics('property_management_submitted', {});
    return ok('Thank you! A property manager will contact you to discuss how we can help.', { leadId: lead.id });
  } catch (e) {
    console.error('[submitPropertyManagement]', e);
    return fail('Something went wrong. Please try again or reach us on WhatsApp.');
  }
}

export async function submitContact(_: ActionState, formData: FormData): Promise<ActionState> {
  if (isSpam(formData)) return ok('Thank you. We will be in touch shortly.');
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail('Please fix the errors below.', { fieldErrors: zodToFieldErrors(parsed.error) });
  const data = parsed.data;

  try {
    await prisma.contactInquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        subject: data.subject || undefined,
        inquiryType: data.inquiryType || undefined,
        message: data.message,
      },
    });
    await logAnalytics('inquiry_submitted', { form: 'contact' });
    return ok('Thank you! Your message has been sent. We will get back to you soon.');
  } catch (e) {
    console.error('[submitContact]', e);
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


