#!/usr/bin/env bash
set -e

echo "Setting up Cartify server..."

# Install dependencies (idempotent)
npm install

# Generate Prisma client (idempotent)
npx prisma generate

# Run migrations (idempotent - prisma migrate deploy is safe to re-run)
npx prisma migrate deploy

echo "Setup complete."
