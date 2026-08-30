FROM oven/bun:1.4-slim AS builder

WORKDIR /app

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock
COPY ./turbo.json ./turbo.json

COPY ./apps/real-time/package.json ./apps/real-time/package.json

COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/redis/package.json ./packages/redis/package.json
COPY ./packages/zodPackage/package.json ./packages/zodPackage/package.json

COPY ./packages/db ./packages/db
COPY ./packages/redis  ./packages/redis 

RUN bun install

COPY ./apps/real-time ./apps/real-time

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# Generting the client
RUN cd packages/db && bun prisma generate 

EXPOSE 8080

CMD ["bun", "run", "start:ws"]