FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app

COPY package.json ./
RUN bun install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build:devices
RUN bun run docs:generate
RUN bun run build

FROM base AS runner-deps
WORKDIR /app

COPY package.json ./
RUN bun install --production

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 999 nodejs && \
  useradd --system --uid 999 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/server.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/bunfig.toml ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./
COPY --from=runner-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["bun", "run", "server.ts"]
