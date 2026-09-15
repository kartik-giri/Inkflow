# Pruner stage
FROM oven/bun:1.4-slim AS pruner

WORKDIR /app

COPY . .

RUN bunx turbo prune worker --docker

# Dependecies stage
FROM oven/bun:1.4-slim AS deps

WORKDIR /app

COPY --from=pruner /app/out/json ./
COPY --from=pruner /app/out/bun.lock ./bun.lock

RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache bun install --frozen-lockfile

# Builder stage
FROM oven/bun:1.4-slim AS builder

WORKDIR /app

COPY --from=deps /app ./
COPY --from=pruner /app/out/full ./

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN cd packages/db && bunx prisma generate

# Runner stage
FROM oven/bun:1.4-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/bun.lock ./bun.lock

# Install ONLY production dependencies
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

# Copy application source
COPY --from=builder /app/apps/worker ./apps/worker
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/packages/redis ./packages/redis


# COPY --from=builder /app ./

RUN groupadd -g 1001 bunuser && \
    useradd -u 1001 -g bunuser bunuser

USER bunuser


CMD [ "bun", "run", "start:worker" ]
































# FROM oven/bun:1.4-slim AS builder

# WORKDIR /app

# COPY ./package.json ./package.json
# COPY ./bun.lock ./bun.lock
# COPY ./turbo.json ./turbo.json

# COPY ./packages/db/package.json ./packages/db/package.json
# COPY ./packages/redis/package.json ./packages/redis/package.json
# COPY ./packages/zodPackage/package.json ./packages/zodPackage/package.json

# COPY ./packages/db ./packages/db
# COPY ./packages/redis ./packages/redis
# COPY ./packages/zodPackage ./packages/zodPackage

# COPY apps/worker/package.json apps/worker/package.json

# RUN bun install

# COPY apps/worker apps/worker

# ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# RUN cd packages/db && bun prisma generate

# EXPOSE 3004

# CMD ["bun", "run", "start:worker"]
