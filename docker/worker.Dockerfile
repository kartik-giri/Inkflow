FROM oven/bun:1.4-slim AS builder

WORKDIR /app

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock
COPY ./turbo.json ./turbo.json

COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/redis/package.json ./packages/redis/package.json
COPY ./packages/zodPackage/package.json ./packages/zodPackage/package.json

COPY ./packages/db ./packages/db
COPY ./packages/redis ./packages/redis
COPY ./packages/zodPackage ./packages/zodPackage

COPY apps/worker/package.json apps/worker/package.json

RUN bun install

COPY apps/worker apps/worker

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN cd packages/db && bun prisma generate

EXPOSE 3004

CMD ["bun", "run", "start:worker"]
