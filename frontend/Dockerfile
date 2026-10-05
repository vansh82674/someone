FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build the Next.js application
RUN bun run build

# Runner stage
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Note: If standalone output is not enabled in next.config.js, 
# you might need to copy node_modules instead of using standalone.
# We will fallback to running next start if standalone is not present.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["bun", "run", "start"]
