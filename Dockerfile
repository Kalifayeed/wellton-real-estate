# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public Next.js values are embedded at build time, not at container startup.
ARG NEXT_PUBLIC_SITE_URL=https://welltonproperties.co.ke
ARG NEXT_PUBLIC_SITE_NAME="Wellton Real Estate"
ARG NEXT_PUBLIC_PHONE
ARG NEXT_PUBLIC_WHATSAPP
ARG NEXT_PUBLIC_EMAIL
ARG NEXT_PUBLIC_ADDRESS="Nairobi, Kenya"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# One-off schema management without shipping the CLI in the app image.
FROM builder AS tools
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl libc6-compat
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy the standalone server + minimal runtime deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Prisma client + engine (generated during build)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# The unprivileged app user must be able to write media, documents and cache.
RUN mkdir -p public/uploads storage .next/cache \
    && chown -R nextjs:nodejs public/uploads storage .next

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
