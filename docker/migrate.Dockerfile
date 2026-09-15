FROM oven/bun:1.4-slim AS migrator

WORKDIR /app

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock
COPY ./turbo.json ./turbo.json

COPY ./packages/db/package.json ./packages/db/package.json

COPY ./packages/db ./packages/db

RUN bun install

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN cd packages/db && bunx prisma generate

# after running this cmd container will stop because this cmd is one time task. unlike starting a webocket or running any long running service.
CMD ["sh", "-c", "cd packages/db && bunx prisma migrate deploy"]

# sh -c means:
# Start a shell and execute the following string as a shell command.