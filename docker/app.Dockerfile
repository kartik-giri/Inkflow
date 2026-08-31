FROM oven/bun:1.4-slim AS builder

WORKDIR /app

# ARG DATABASE_URL
# ARG NEXTAUTH_SECRET
# ARG NEXTAUTH_URL

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock
COPY ./turbo.json ./turbo.json

COPY ./packages/db/package.json ./packages/db/package.json 
COPY ./packages/typescript-config/package.json ./packages/typescript-config/package.json 
COPY ./packages/zodPackage/package.json ./packages/zodPackage/package.json 

COPY ./packages/db ./packages/db
COPY ./packages/typescript-config ./packages/typescript-config
COPY ./packages/zodPackage ./packages/zodPackage

COPY ./apps/inkflowapp/package.json ./apps/inkflowapp/package.json

RUN bun install

COPY ./apps/inkflowapp ./apps/inkflowapp 

# ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN cd packages/db && bun prisma generate

RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL --mount=type=secret,id=NEXTAUTH_SECRET,env=NEXTAUTH_SECRET --mount=type=secret,id=NEXTAUTH_URL,env=NEXTAUTH_URL bun run build

EXPOSE 3000

CMD ["bun", "run", "start:app"]