#!/bin/sh
set -e

npx prisma migrate deploy --schema prisma/schema.prisma
npx tsx prisma/seed.ts
exec node dist/index.js