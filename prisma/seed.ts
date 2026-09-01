import { PrismaClient, ListingPurpose, PropertyType, PropertyStatus, RentalFrequency, FurnishStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const locations = [
  'Kilimani', 'Kileleshwa', 'Lavington', 'Westlands', 'Karen', 'Runda',
  'Kitisuru', 'Muthaiga', 'Loresho', 'Upper Hill', 'Riverside', 'Parklands',
];

const amenities = [
  'Swimming Pool', 'Gym', 'Backup Generator', 'Parking', '24/7 Security',
  'Pet Friendly', 'Internet / Fibre', 'Elevator', 'Garden', 'Balcony',
  'CCTV', 'Borehole Water', 'Playground', 'Serviced', 'Fitted Kitchen',
  'Electric Fence', 'Children play area', 'Dining Area', 'Wardrobes', 'Terrace',
];

interface SeedUser { name: string; email: string; role: 'ADMIN' | 'MANAGER' | 'AGENT'; phone: string; }
const users: SeedUser[] = [
  { name: 'Sarah Wanjiru', email: 'admin@wellton.com', role: 'ADMIN', phone: '+254700000001' },
  { name: 'James Otieno', email: 'manager@wellton.com', role: 'MANAGER', phone: '+254700000002' },
  { name: 'Brian Kiptoo', email: 'agent@wellton.com', role: 'AGENT', phone: '+254700000003' },
  { name: 'Grace Akinyi', email: 'agent2@wellton.com', role: 'AGENT', phone: '+254700000004' },
];

async function main() {
  console.log('Seeding Wellton Real Estate demo data…');

  for (let i = 0; i < locations.length; i++) {
    const name = locations[i];
    await prisma.location.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
      update: { name, sortOrder: i },
      create: { name, slug: name.toLowerCase().replace(/\s+/g, '-'), sortOrder: i },
    });
  }
  for (const a of amenities) {
    await prisma.amenity.upsert({
      where: { slug: a.toLowerCase().replace(/\s+/g, '-') },
      update: { name: a },
      create: { name: a, slug: a.toLowerCase().replace(/\s+/g, '-') },
    });
  }

  const passwordHash = await bcrypt.hash('Wellton@2026', 12);
  const userRecords: Record<string, string> = {};
  for (const u of users) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, role: u.role, isActive: true },
      create: { name: u.name, email: u.email, phone: u.phone, role: u.role, passwordHash },
    });
    userRecords[u.role] = created.id;
  }
  console.log('  Users: admin@wellton.com / manager@wellton.com / agent@wellton.com (password: Wellton@2026)');

  const cat = await prisma.blogCategory.upsert({
    where: { slug: 'buying-guides' },
    update: { name: 'Buying Guides' },
    create: { name: 'Buying Guides', slug: 'buying-guides' },
  });
  const catRent = await prisma.blogCategory.upsert({
    where: { slug: 'renting-in-nairobi' },
    update: { name: 'Renting in Nairobi' },
    create: { name: 'Renting in Nairobi', slug: 'renting-in-nairobi' },
  });

  const posts = [
    {
      slug: 'best-areas-to-buy-property-in-nairobi',
      title: 'Best Areas to Buy Property in Nairobi',
      categoryId: cat.id,
      excerpt: 'A look at the most sought-after neighbourhoods for homebuyers and investors in Nairobi.',
      content: '## Finding the right neighbourhood\n\nNairobi offers a wide range of residential areas, each with its own character, price points and amenities.\n\n### Popular residential areas\n\n* **Kilimani** — central, well-connected, popular with professionals and young families.\n* **Karen** — leafy, spacious homes and a relaxed suburban pace.\n* **Westlands** — a commercial hub with apartments and strong rental demand.\n* **Runda & Kitisuru** — upscale, gated communities on the outskirts.\n\n### What to consider\n\n* **Budget** — prices vary significantly by location.\n* **Commute** — think about access to work and schools.\n* **Amenities** — proximity to shopping, hospitals and international schools.\n\nGet in touch with the Wellton team to discuss what would suit you best.',
    },
    {
      slug: 'off-plan-vs-completed-properties',
      title: 'Off-Plan vs Completed Properties: Which Is Right for You?',
      categoryId: cat.id,
      excerpt: 'Comparing the benefits and trade-offs of buying off-plan versus completed developments in Kenya.',
      content: '## Two paths to ownership\n\nWhen buying property in Kenya you will often choose between off-plan and completed developments.\n\n### Off-plan\n\n* Often lower entry prices and staged payment plans.\n* Potential for capital appreciation by completion.\n* Requires patience and trust in the developer\'s delivery.\n\n### Completed\n\n* Move in or rent out immediately.\n* You can see exactly what you are buying.\n* Usually a higher upfront price.\n\nOur team can help you evaluate both options and understand the risks.',
    },
    {
      slug: 'renting-property-kenya-foreigner',
      title: 'Renting Property in Kenya as a Foreigner or Diaspora',
      categoryId: catRent.id,
      excerpt: 'What international clients and returning Kenyans need to know about renting in Nairobi.',
      content: '## Renting from abroad\n\nRenting in Nairobi is straightforward, but a few practical points help.\n\n* **Documentation** — you will typically need a passport or ID and proof of income.\n* **Deposits** — usually one to two months rent plus service charge.\n* **Viewings** — we arrange physical and virtual viewings for clients abroad.\n* **Furnished vs unfurnished** — a wide range is available.\n\nOur diaspora team can shortlist properties, handle viewings and guide you through the application.',
    },
    {
      slug: 'property-management-guide',
      title: "A Landlord's Guide to Property Management",
      categoryId: catRent.id,
      excerpt: 'How professional property management protects your investment and reduces stress for landlords.',
      content: '## Why manage professionally?\n\nOwning a rental property comes with responsibilities — from marketing and tenant screening to maintenance and rent collection.\n\n* **Tenant sourcing** — find reliable, screened tenants.\n* **Rent collection** — consistent and on time.\n* **Maintenance** — keep the property in good condition.\n* **Compliance** — handle agreements and legal requirements.\n\nWellton\'s management service is designed to give landlords peace of mind.',
    },
  ];

  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { title: p.title, categoryId: p.categoryId, excerpt: p.excerpt, content: p.content, isPublished: true, publishedAt: new Date() },
      create: { ...p, isPublished: true, publishedAt: new Date(), authorId: userRecords.ADMIN },
    });
  }

  await seedProperties(prisma, userRecords);
  console.log('  Properties seeded.');
  console.log('Done.');
}

async function seedProperties(prisma: PrismaClient, users: Record<string, string>) {
  const allLocations = await prisma.location.findMany();
  const locBy = (idx: number) => allLocations[idx % allLocations.length].id;
  const allAmenities = await prisma.amenity.findMany();
  const amIdx = (start: number, count: number) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) list.push(allAmenities[(start + i) % allAmenities.length].id);
    return list;
  };

  const data: Array<{
    title: string; type: PropertyType; purpose: ListingPurpose; status: PropertyStatus;
    price: number; rent: number; freq: RentalFrequency; beds: number; baths: number; size: number;
    furn: FurnishStatus; featured: boolean; locationIdx: number; area: string; desc: string;
    deposit: number; service: number; virtual: boolean;
  }> = [
    { title: 'Skyline Heights Apartment — Kilimani', type: PropertyType.APARTMENT, purpose: ListingPurpose.SALE, status: PropertyStatus.COMPLETED, price: 18500000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 3, baths: 2, size: 156, furn: FurnishStatus.UNFURNISHED, featured: true, locationIdx: 0, area: 'Kilimani', desc: 'A bright 3-bedroom apartment in the heart of Kilimani with a spacious balcony and secure gated parking.', deposit: 0, service: 0, virtual: false },
    { title: 'Karen Green Residence', type: PropertyType.HOUSE, purpose: ListingPurpose.SALE, status: PropertyStatus.COMPLETED, price: 52000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 4, baths: 4, size: 380, furn: FurnishStatus.UNFURNISHED, featured: true, locationIdx: 4, area: 'Karen', desc: 'A spacious family home in leafy Karen with a large garden, double garage and staff quarters.', deposit: 0, service: 0, virtual: true },
    { title: 'Westlands Corporate Apartment', type: PropertyType.APARTMENT, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 145000, freq: RentalFrequency.MONTHLY, beds: 2, baths: 2, size: 112, furn: FurnishStatus.FURNISHED, featured: true, locationIdx: 3, area: 'Westlands', desc: 'A fully furnished 2-bedroom apartment in Westlands, ideal for professionals, with gym and pool access.', deposit: 290000, service: 15000, virtual: false },
    { title: 'Riverside Serviced Residence', type: PropertyType.APARTMENT, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 220000, freq: RentalFrequency.MONTHLY, beds: 3, baths: 3, size: 168, furn: FurnishStatus.SERVICED, featured: true, locationIdx: 10, area: 'Riverside', desc: 'A serviced 3-bedroom residence on Riverside Drive with hotel-style amenities and 24/7 staffing.', deposit: 440000, service: 40000, virtual: true },
    { title: 'Runda Modern Villa', type: PropertyType.VILLA, purpose: ListingPurpose.SALE, status: PropertyStatus.COMPLETED, price: 98000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 5, baths: 5, size: 520, furn: FurnishStatus.UNFURNISHED, featured: true, locationIdx: 5, area: 'Runda', desc: 'A luxurious 5-bedroom villa in a secure gated community in Runda, featuring a pool and mature gardens.', deposit: 0, service: 0, virtual: false },
    { title: 'Lavington Family Townhouse', type: PropertyType.TOWNHOUSE, purpose: ListingPurpose.BOTH, status: PropertyStatus.READY_TO_MOVE_IN, price: 26500000, rent: 110000, freq: RentalFrequency.MONTHLY, beds: 4, baths: 3, size: 240, furn: FurnishStatus.PARTLY_FURNISHED, featured: true, locationIdx: 2, area: 'Lavington', desc: 'A well-appointed 4-bedroom townhouse in Lavington available for sale or rent, with a private garden.', deposit: 220000, service: 18000, virtual: false },
  ];


  let coverIndex = 0;
  for (const d of data) {
    const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const img1 = `/uploads/properties/placeholder-${(coverIndex % 12) + 1}.svg`;
    const img2 = `/uploads/properties/placeholder-${((coverIndex + 4) % 12) + 1}.svg`;
    const img3 = `/uploads/properties/placeholder-${((coverIndex + 8) % 12) + 1}.svg`;
    coverIndex++;

    if (await prisma.property.findUnique({ where: { slug } })) continue;

    await prisma.property.create({
      data: {
        title: d.title, slug, description: d.desc, locationId: locBy(d.locationIdx), area: d.area,
        propertyType: d.type, listingPurpose: d.purpose, price: d.price || undefined, rentalPrice: d.rent || undefined,
        rentalFrequency: d.freq, bedrooms: d.beds || undefined, bathrooms: d.baths || undefined,
        sizeSqm: d.size || undefined, furnishStatus: d.furn, propertyStatus: d.status,
        isFeatured: d.featured, isPublished: true, ownerId: users.ADMIN,
        securityDeposit: d.deposit || undefined, serviceCharge: d.service || undefined,
        virtualTourUrl: d.virtual ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
        minRentalPeriod: d.purpose === 'RENT' || d.purpose === 'BOTH' ? '12 months' : undefined,
        leaseTerms: d.purpose === 'RENT' || d.purpose === 'BOTH' ? 'Standard lease agreement' : undefined,
        tenantRequirement: d.purpose === 'RENT' || d.purpose === 'BOTH' ? '3 months rent in advance or guarantor' : undefined,
        petPolicy: d.furn === 'FURNISHED' ? 'Pets on request' : 'Pets considered',
        utilitiesIncluded: d.furn === 'SERVICED' ? 'All utilities included' : undefined,
        managedByWellton: d.purpose === 'RENT',
        images: {
          create: [
            { url: img1, isCover: true, sortOrder: 0, altText: `${d.title} — main` },
            { url: img2, isCover: false, sortOrder: 1, altText: `${d.title} — interior` },
            { url: img3, isCover: false, sortOrder: 2, altText: `${d.title} — additional` },
          ],
        },
        amenities: { create: amIdx(d.locationIdx, 5).map((amenityId) => ({ amenityId })) },
      },
    });
  }


  const extra: typeof data = [
    { title: 'Kileleshwa Off-Plan Development', type: PropertyType.OFF_PLAN_DEVELOPMENT, purpose: ListingPurpose.SALE, status: PropertyStatus.OFF_PLAN, price: 14500000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 2, baths: 2, size: 98, furn: FurnishStatus.UNFURNISHED, featured: true, locationIdx: 1, area: 'Kileleshwa', desc: 'A 2-bedroom off-plan apartment with a flexible payment plan and completion expected soon.', deposit: 0, service: 0, virtual: true },
    { title: 'Muthaiga Luxury Estate', type: PropertyType.HOUSE, purpose: ListingPurpose.SALE, status: PropertyStatus.COMPLETED, price: 145000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 6, baths: 6, size: 640, furn: FurnishStatus.FURNISHED, featured: false, locationIdx: 7, area: 'Muthaiga', desc: 'A premier 6-bedroom estate in Muthaiga with extensive grounds and staff accommodation.', deposit: 0, service: 0, virtual: true },
    { title: 'Upper Hill Executive Apartment', type: PropertyType.APARTMENT, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 190000, freq: RentalFrequency.MONTHLY, beds: 3, baths: 3, size: 170, furn: FurnishStatus.FURNISHED, featured: false, locationIdx: 9, area: 'Upper Hill', desc: 'An executive furnished apartment in Upper Hill near the CBD, with concierge and gym.', deposit: 380000, service: 30000, virtual: false },
    { title: 'Kitisuru Investment Property', type: PropertyType.INVESTMENT, purpose: ListingPurpose.SALE, status: PropertyStatus.SOLD, price: 34000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 4, baths: 3, size: 260, furn: FurnishStatus.UNFURNISHED, featured: false, locationIdx: 6, area: 'Kitisuru', desc: 'An investment opportunity in a sought-after area — recently sold. New opportunities available.', deposit: 0, service: 0, virtual: false },
    { title: 'Parklands Furnished Apartment', type: PropertyType.APARTMENT, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 95000, freq: RentalFrequency.MONTHLY, beds: 2, baths: 2, size: 105, furn: FurnishStatus.FURNISHED, featured: true, locationIdx: 11, area: 'Parklands', desc: 'A furnished 2-bedroom apartment in Parklands, centrally located with amenities nearby.', deposit: 190000, service: 12000, virtual: false },
    { title: 'Loresho Family Home', type: PropertyType.HOUSE, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 175000, freq: RentalFrequency.MONTHLY, beds: 4, baths: 3, size: 300, furn: FurnishStatus.UNFURNISHED, featured: false, locationIdx: 8, area: 'Loresho', desc: 'A spacious family home in Loresho with a mature garden and staff quarters.', deposit: 350000, service: 25000, virtual: false },
    { title: 'Westlands Commercial Space', type: PropertyType.COMMERCIAL, purpose: ListingPurpose.RENT, status: PropertyStatus.AVAILABLE_FOR_RENT, price: 0, rent: 320000, freq: RentalFrequency.MONTHLY, beds: 0, baths: 2, size: 220, furn: FurnishStatus.UNFURNISHED, featured: false, locationIdx: 3, area: 'Westlands', desc: 'Prime commercial office space in Westlands with ample parking and excellent accessibility.', deposit: 640000, service: 45000, virtual: false },
    { title: 'Kilimani Completed Development', type: PropertyType.COMPLETED_DEVELOPMENT, purpose: ListingPurpose.SALE, status: PropertyStatus.COMPLETED, price: 21000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 3, baths: 2, size: 145, furn: FurnishStatus.UNFURNISHED, featured: false, locationIdx: 0, area: 'Kilimani', desc: 'A completed development in Kilimani offering move-in-ready 3-bedroom apartments.', deposit: 0, service: 0, virtual: false },
    { title: 'Amaya — Off-Plan Project', type: PropertyType.OFF_PLAN_DEVELOPMENT, purpose: ListingPurpose.SALE, status: PropertyStatus.UNDER_CONSTRUCTION, price: 18000000, rent: 0, freq: RentalFrequency.MONTHLY, beds: 3, baths: 2, size: 132, furn: FurnishStatus.UNFURNISHED, featured: false, locationIdx: 1, area: 'Kileleshwa', desc: 'A premium off-plan development under construction with a buyer-friendly payment plan.', deposit: 0, service: 0, virtual: true },
  ];

  for (const d of extra) {
    const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const img1 = `/uploads/properties/placeholder-${(coverIndex % 12) + 1}.svg`;
    coverIndex++;
    if (await prisma.property.findUnique({ where: { slug } })) continue;
    await prisma.property.create({
      data: {
        title: d.title, slug, description: d.desc, locationId: locBy(d.locationIdx), area: d.area,
        propertyType: d.type, listingPurpose: d.purpose, price: d.price || undefined, rentalPrice: d.rent || undefined,
        rentalFrequency: d.freq, bedrooms: d.beds || undefined, bathrooms: d.baths || undefined,
        sizeSqm: d.size || undefined, furnishStatus: d.furn, propertyStatus: d.status,
        isFeatured: d.featured, isPublished: true, ownerId: users.ADMIN,
        securityDeposit: d.deposit || undefined, serviceCharge: d.service || undefined,
        virtualTourUrl: d.virtual ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
        minRentalPeriod: d.purpose === 'RENT' || d.purpose === 'BOTH' ? '12 months' : undefined,
        leaseTerms: d.purpose === 'RENT' || d.purpose === 'BOTH' ? 'Standard lease agreement' : undefined,
        tenantRequirement: d.purpose === 'RENT' || d.purpose === 'BOTH' ? '3 months rent in advance or guarantor' : undefined,
        petPolicy: d.furn === 'FURNISHED' ? 'Pets on request' : 'Pets considered',
        utilitiesIncluded: d.furn === 'SERVICED' ? 'All utilities included' : undefined,
        managedByWellton: d.purpose === 'RENT',
        images: { create: [{ url: img1, isCover: true, sortOrder: 0, altText: `${d.title} — main` }] },
        amenities: { create: amIdx(d.locationIdx, 4).map((amenityId) => ({ amenityId })) },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


