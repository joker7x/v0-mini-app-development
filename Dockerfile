# Use official Node.js LTS image
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Run dev server
CMD ["pnpm", "dev"]