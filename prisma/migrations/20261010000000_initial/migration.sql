-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'AGENT');

-- CreateEnum
CREATE TYPE "ListingPurpose" AS ENUM ('SALE', 'RENT', 'BOTH');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'TOWNHOUSE', 'VILLA', 'OFF_PLAN_DEVELOPMENT', 'COMPLETED_DEVELOPMENT', 'INVESTMENT', 'COMMERCIAL', 'LAND');

-- CreateEnum
CREATE TYPE "RentalFrequency" AS ENUM ('MONTHLY', 'WEEKLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "FurnishStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'SERVICED', 'PARTLY_FURNISHED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('OFF_PLAN', 'UNDER_CONSTRUCTION', 'COMPLETED', 'READY_TO_MOVE_IN', 'AVAILABLE_FOR_RENT', 'OCCUPIED', 'SOLD', 'RENTED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'VIEWING_SCHEDULED', 'APPLICATION_SUBMITTED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'NOT_QUALIFIED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'REFERRAL', 'AGENT', 'PORTAL', 'GOOGLE', 'WALK_IN', 'OTHER');

-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'VIEWING_SCHEDULED', 'DOCUMENTS_REQUESTED', 'APPROVED', 'DECLINED', 'LEASE_SIGNED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'CONTACTED', 'APPROVED', 'REJECTED', 'ONBOARDED', 'LISTED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SELL_MY_PROPERTY', 'RENT_OUT_PROPERTY', 'PROPERTY_MANAGEMENT', 'RENTAL_VALUATION', 'TENANT_SOURCING', 'PROPERTY_MARKETING');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('MORE_INFORMATION', 'SCHEDULE_VIEWING', 'APPLY_TO_RENT', 'PAYMENT_TERMS', 'VIRTUAL_VIEWING');

-- CreateEnum
CREATE TYPE "PurposeType" AS ENUM ('LIVING', 'INVESTMENT', 'RENTAL_INCOME', 'FAMILY_USE', 'SHORT_TERM_ACCOMMODATION', 'RELOCATION');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('PHONE', 'WHATSAPP', 'EMAIL');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_PUBLISHED', 'PROPERTY_UNPUBLISHED', 'PROPERTY_DELETED', 'LEAD_ASSIGNED', 'LEAD_REASSIGNED', 'LEAD_STATUS_CHANGED', 'APPLICATION_UPDATED', 'VIEWING_SCHEDULED', 'USER_CREATED', 'USER_PERMISSIONS_CHANGED', 'SUBMISSION_UPDATED', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationId" TEXT NOT NULL,
    "area" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "listingPurpose" "ListingPurpose" NOT NULL,
    "price" DECIMAL(14,2),
    "rentalPrice" DECIMAL(14,2),
    "rentalFrequency" "RentalFrequency" DEFAULT 'MONTHLY',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "sizeSqm" INTEGER,
    "furnishStatus" "FurnishStatus",
    "propertyStatus" "PropertyStatus" NOT NULL DEFAULT 'COMPLETED',
    "availabilityDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "leaseTerms" TEXT,
    "minRentalPeriod" TEXT,
    "paymentPlan" TEXT,
    "securityDeposit" DECIMAL(14,2),
    "serviceCharge" DECIMAL(14,2),
    "utilities" TEXT,
    "tenantRequirement" TEXT,
    "petPolicy" TEXT,
    "utilitiesIncluded" TEXT,
    "managedByWellton" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "virtualTourUrl" TEXT,
    "mapEmbedUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_videos" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_floor_plans" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_floor_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("propertyId","amenityId")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "propertyId" TEXT,
    "listingPurpose" "ListingPurpose",
    "budget" DECIMAL(14,2),
    "budgetFrequency" "RentalFrequency",
    "preferredLocation" TEXT,
    "preferredMoveIn" TIMESTAMP(3),
    "inquiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'note',
    "note" TEXT,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_assignments" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewings" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "leadId" TEXT,
    "agentId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3),
    "status" "ViewingStatus" NOT NULL DEFAULT 'REQUESTED',
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viewings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_applications" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "leadId" TEXT,
    "applicantName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "currentAddress" TEXT,
    "preferredMoveIn" TIMESTAMP(3),
    "leaseDuration" TEXT,
    "employmentStatus" TEXT,
    "employer" TEXT,
    "incomeRange" TEXT,
    "occupants" INTEGER,
    "references" TEXT,
    "additionalInfo" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storedPath" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_submissions" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "location" TEXT,
    "propertyType" "PropertyType",
    "bedrooms" INTEGER,
    "askingPrice" DECIMAL(14,2),
    "rentalPrice" DECIMAL(14,2),
    "furnishStatus" "FurnishStatus",
    "availability" TEXT,
    "description" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "serviceType" "ServiceType",
    "contactMethod" "ContactMethod" DEFAULT 'PHONE',
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedById" TEXT,
    "reviewedNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_reviews" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" "SubmissionStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "categoryId" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "subject" TEXT,
    "inquiryType" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL DEFAULT 'OTHER',
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytic_events" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "path" TEXT,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytic_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_slug_key" ON "amenities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_slug_idx" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_propertyType_idx" ON "properties"("propertyType");

-- CreateIndex
CREATE INDEX "properties_listingPurpose_idx" ON "properties"("listingPurpose");

-- CreateIndex
CREATE INDEX "properties_isPublished_idx" ON "properties"("isPublished");

-- CreateIndex
CREATE INDEX "properties_locationId_idx" ON "properties"("locationId");

-- CreateIndex
CREATE INDEX "property_images_propertyId_idx" ON "property_images"("propertyId");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_assignedToId_idx" ON "leads"("assignedToId");

-- CreateIndex
CREATE INDEX "leads_propertyId_idx" ON "leads"("propertyId");

-- CreateIndex
CREATE INDEX "lead_activities_leadId_idx" ON "lead_activities"("leadId");

-- CreateIndex
CREATE INDEX "lead_assignments_leadId_idx" ON "lead_assignments"("leadId");

-- CreateIndex
CREATE INDEX "viewings_propertyId_idx" ON "viewings"("propertyId");

-- CreateIndex
CREATE INDEX "viewings_leadId_idx" ON "viewings"("leadId");

-- CreateIndex
CREATE INDEX "rental_applications_propertyId_idx" ON "rental_applications"("propertyId");

-- CreateIndex
CREATE INDEX "rental_applications_status_idx" ON "rental_applications"("status");

-- CreateIndex
CREATE INDEX "owner_submissions_status_idx" ON "owner_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_isPublished_idx" ON "blog_posts"("isPublished");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "analytic_events_event_idx" ON "analytic_events"("event");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_videos" ADD CONSTRAINT "property_videos_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_floor_plans" ADD CONSTRAINT "property_floor_plans_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_applications" ADD CONSTRAINT "rental_applications_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_applications" ADD CONSTRAINT "rental_applications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_applications" ADD CONSTRAINT "rental_applications_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "rental_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_submissions" ADD CONSTRAINT "owner_submissions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "owner_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;