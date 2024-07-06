#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
# You can use wait-for-it.sh or any other method you prefer
# Example with wait-for-it.sh:
# ./wait-for-it.sh -t 30 acme-db:5432 -- echo "PostgreSQL is up"

# Run the seeding script
bun run ./scripts/seed.ts

# Start the Next.js development server
bun run dev
