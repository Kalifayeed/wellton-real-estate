// Display label + metadata maps for enums and option lists used across the UI.

export const LOCATIONS = [
  'Kilimani',
  'Kileleshwa',
  'Lavington',
  'Westlands',
  'Karen',
  'Runda',
  'Kitisuru',
  'Muthaiga',
  'Loresho',
  'Upper Hill',
  'Riverside',
  'Parklands',
  'Kasarani',
] as const;

export type LocationName = (typeof LOCATIONS)[number];

export const salePriceBands = [
  { value: '0-15000000', label: 'Under KSh 15M' },
  { value: '15000000-30000000', label: 'KSh 15M – 30M' },
  { value: '30000000-50000000', label: 'KSh 30M – 50M' },
  { value: '50000000-100000000', label: 'KSh 50M – 100M' },
  { value: '100000000-250000000', label: 'KSh 100M – 250M' },
  { value: '250000000-', label: 'Over KSh 250M' },
] as const;

export const rentalPriceBands = [
  { value: '0-50000', label: 'Under KSh 50K' },
  { value: '50000-100000', label: 'KSh 50K – 100K' },
  { value: '100000-200000', label: 'KSh 100K – 200K' },
  { value: '200000-350000', label: 'KSh 200K – 350K' },
  { value: '350000-500000', label: 'KSh 350K – 500K' },
  { value: '500000-', label: 'Over KSh 500K' },
] as const;

export const listLabelMaps = {
  role: {
    ADMIN: 'Administrator',
    MANAGER: 'Manager',
    AGENT: 'Agent',
  },
  listingPurpose: {
    SALE: 'For Sale',
    RENT: 'For Rent',
    BOTH: 'For Sale & Rent',
  },
  propertyType: {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    TOWNHOUSE: 'Townhouse',
    VILLA: 'Villa',
    OFF_PLAN_DEVELOPMENT: 'Off-Plan Development',
    COMPLETED_DEVELOPMENT: 'Completed Development',
    INVESTMENT: 'Investment Property',
    COMMERCIAL: 'Commercial Property',
    LAND: 'Land',
  },
  rentalFrequency: {
    MONTHLY: 'Monthly',
    WEEKLY: 'Weekly',
    YEARLY: 'Yearly',
  },
  furnishStatus: {
    FURNISHED: 'Furnished',
    UNFURNISHED: 'Unfurnished',
    SERVICED: 'Serviced',
    PARTLY_FURNISHED: 'Partly Furnished',
  },
  propertyStatus: {
    OFF_PLAN: 'Off-Plan',
    UNDER_CONSTRUCTION: 'Under Construction',
    COMPLETED: 'Completed',
    READY_TO_MOVE_IN: 'Ready to Move In',
    AVAILABLE_FOR_RENT: 'Available for Rent',
    OCCUPIED: 'Occupied',
    SOLD: 'Sold',
    RENTED: 'Rented',
    UNAVAILABLE: 'Unavailable',
  },
  leadStatus: {
    NEW: 'New',
    CONTACTED: 'Contacted',
    INTERESTED: 'Interested',
    VIEWING_SCHEDULED: 'Viewing Scheduled',
    APPLICATION_SUBMITTED: 'Application Submitted',
    NEGOTIATING: 'Negotiating',
    CLOSED_WON: 'Closed Won',
    CLOSED_LOST: 'Closed Lost',
    NOT_QUALIFIED: 'Not Qualified',
  },
  leadSource: {
    WEBSITE: 'Website',
    WHATSAPP: 'WhatsApp',
    FACEBOOK: 'Facebook',
    INSTAGRAM: 'Instagram',
    REFERRAL: 'Referral',
    AGENT: 'Agent',
    PORTAL: 'Property Portal',
    GOOGLE: 'Google',
    WALK_IN: 'Walk-in',
    OTHER: 'Other',
  },
  viewingStatus: {
    REQUESTED: 'Requested',
    SCHEDULED: 'Scheduled',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    RESCHEDULED: 'Rescheduled',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No-show',
  },
  applicationStatus: {
    NEW: 'New',
    UNDER_REVIEW: 'Under Review',
    VIEWING_SCHEDULED: 'Viewing Scheduled',
    DOCUMENTS_REQUESTED: 'Documents Requested',
    APPROVED: 'Approved',
    DECLINED: 'Declined',
    LEASE_SIGNED: 'Lease Signed',
    WITHDRAWN: 'Withdrawn',
  },
  submissionStatus: {
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    CONTACTED: 'Contacted',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    ONBOARDED: 'Onboarded',
    LISTED: 'Listed',
  },
  serviceType: {
    SELL_MY_PROPERTY: 'Sell My Property',
    RENT_OUT_PROPERTY: 'Rent Out My Property',
    PROPERTY_MANAGEMENT: 'Property Management',
    RENTAL_VALUATION: 'Rental Valuation',
    TENANT_SOURCING: 'Tenant Sourcing',
    PROPERTY_MARKETING: 'Property Marketing',
  },
  inquiryType: {
    MORE_INFORMATION: 'More information',
    SCHEDULE_VIEWING: 'Schedule a viewing',
    APPLY_TO_RENT: 'Apply to rent',
    PAYMENT_TERMS: 'Payment terms',
    VIRTUAL_VIEWING: 'Virtual viewing',
  },
  purposeType: {
    LIVING: 'Living',
    INVESTMENT: 'Investment',
    RENTAL_INCOME: 'Rental income',
    FAMILY_USE: 'Family use',
    SHORT_TERM_ACCOMMODATION: 'Short-term accommodation',
    RELOCATION: 'Relocation',
  },
  contactMethod: {
    PHONE: 'Phone',
    WHATSAPP: 'WhatsApp',
    EMAIL: 'Email',
  },
} as const;

export type ListLabelKey = keyof typeof listLabelMaps;

export function labelOf(map: keyof typeof listLabelMaps, value: string): string {
  const m = listLabelMaps[map] as Record<string, string>;
  return m[value] ?? value;
}

// Map for property cards: which status renders as a "sold/rented" banner.
export const CLOSED_STATUSES = ['SOLD', 'RENTED', 'UNAVAILABLE', 'OCCUPIED'];
