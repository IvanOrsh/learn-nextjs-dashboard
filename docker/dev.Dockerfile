FROM imbios/bun-node:18-slim
WORKDIR /app/acme-dashboard

COPY package.json ./
COPY bun.lockb ./
COPY scripts ./scripts
# COPY wait-for-it.sh ./

RUN bun install

COPY . .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Set the database host and port for wait-for-it
# ENV DB_HOST=postgres
# ENV DB_PORT=5435

# Run the seeding script and start the Next.js dev server
CMD ["./docker-entrypoint.sh"]

# RUN bun next build
# and
# RUN bun next start

# OR for sart Next.js in development, comment above two lines and uncomment below line


# Note: Don't expose ports here, Compose will handle that for us