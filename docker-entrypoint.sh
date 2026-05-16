#!/bin/sh

echo "Waiting for database..."
sleep 5

echo "Pushing Prisma schema to database..."
npx prisma db push --skip-generate || true

echo "Generating Prisma client..."
npx prisma generate

echo "Seeding roles and permissions..."
npm run seed:roles || true

echo "Starting backend..."
npm run dev
