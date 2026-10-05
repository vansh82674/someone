FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Expose port (adjust if your backend uses a different default port)
EXPOSE 5000

# Run the backend using Bun's native TypeScript support
CMD ["bun", "src/index.ts"]
