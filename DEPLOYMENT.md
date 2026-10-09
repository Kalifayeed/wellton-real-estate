# Wellton Properties on Vercel

Public domain: https://welltonproperties.co.ke

Deploy this Next.js application to Vercel with Supabase PostgreSQL and Storage.
Truehost remains the domain registrar/DNS provider. Keep existing email records.

## Database and storage

1. Provision a Supabase project owned by the business.
2. Use its transaction-pooler PostgreSQL URL for DATABASE_URL, with
   `pgbouncer=true&connection_limit=1` in the query string. Use a direct or
   session-pooler URL for DIRECT_URL so migrations do not use transaction pooling.
3. For a **new empty database**, run `npx prisma migrate deploy`.
   If importing the WSL database, first back it up, verify its schema matches the
   initial migration, and baseline it with
   `npx prisma migrate resolve --applied 20261010000000_initial` instead of
   replaying table creation on an existing database.
4. Create a PUBLIC `wellton-media` bucket for property images and a PRIVATE
   `wellton-documents` bucket for rental documents. Do not give anonymous clients
   write access to either bucket or read access to private documents. Only the
   server uses SUPABASE_SERVICE_ROLE_KEY; never prefix that secret with NEXT_PUBLIC.
5. Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and both bucket names in Vercel.

Do not run the demo seed on production. It creates sample listings and staff
accounts with publicly documented passwords. Use `npm run db:admin` with
ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD to create a first real administrator.
It refuses to overwrite an existing account. Remove those three temporary
environment variables after creating the account.

The source copy does not include the running WSL database. Transfer real listings,
accounts, public uploads and private documents deliberately if needed.
Old local media paths must be migrated to the corresponding cloud objects and
database references before switching traffic.

## Vercel project

Import Kalifayeed/wellton-real-estate, select Next.js, and use Node.js 22.x.
Set the values in .env.production.example, including a unique random AUTH_SECRET
(generate with `openssl rand -hex 32`). The build runs `npm run build`;
it generates Prisma Client without applying migrations or seeding data.
Public contact details are embedded at build time, so rebuild after changes.
Use a separate database and storage project for preview deployments.

The app stores new media in Supabase when its credentials are configured. On
Vercel it refuses to fall back to ephemeral local storage. Supporting documents
are read server-side through the authenticated document route, never public URLs.
Forms accept up to 4 MB in combined attachments and fields, leaving headroom under
Vercel's 4.5 MB payload limit. Upload errors are shown rather than silently ignored.

## Connect the domain and verify

1. Verify the deployment on its Vercel URL with the actual production database.
2. Add welltonproperties.co.ke and www.welltonproperties.co.ke to the Vercel project.
3. Apply the exact DNS records Vercel returns in the authoritative DNS zone.
   Preserve MX, SPF, DKIM and unrelated records. Do not guess an IP address.
4. Wait for DNS validation and HTTPS certificate issuance, then test the custom domain.

Check the homepage, property search/details, enquiry submission, staff login,
image upload, private document permissions, sitemap.xml and robots.txt. Verify
uploads persist across a redeploy. Back up PostgreSQL and both buckets.

The existing Dockerfile remains available for self-hosting; Vercel does not use it.
