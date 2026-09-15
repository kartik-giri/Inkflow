FROM oven/bun:1.4-slim AS pruner

WORKDIR /app

COPY . .
# create the mini monorepo for inkflow app with docker caching.
# "Take my entire monorepo and create a smaller version containing everything necessary to build inkflowapp."
RUN bunx turbo prune inkflowapp --docker


FROM oven/bun:1.4-slim AS deps

WORKDIR /app

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/bun.lock ./bun.lock

# copy and installs the dependencies 
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache bun install --frozen-lockfile


FROM oven/bun:1.4-slim AS builder

WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# copying all installed dependencies from dep stage.
COPY --from=deps /app ./
# Copying full folder whcih have full codebase from pruner stage.
COPY --from=pruner /app/out/full ./
# COPY --from=pruner /app/out/bun.lock ./bun.lock

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN cd packages/db && bunx prisma generate

# COPY the out/full from pruner where all the code for application and packages is.
# And also copy the node moules from deps stage
# Than build the next project by passing args and envs from compose.
RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL --mount=type=secret,id=NEXTAUTH_SECRET,env=NEXTAUTH_SECRET --mount=type=secret,id=NEXTAUTH_URL,env=NEXTAUTH_URL bun run build


FROM oven/bun:1.4-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Listen on all network interfaces inside the container.
ENV HOSTNAME=0.0.0.0 

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs nextjs

# Next.js standalone outpu
# --chown=nextjs:nodejs -> When copying these files, make nextjs the owner and nodejs the group.
COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/inkflowapp/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/inkflowapp/.next/static \
    ./apps/inkflowapp/.next/static

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/inkflowapp/public \
    ./apps/inkflowapp/public


USER nextjs

EXPOSE 3000

CMD ["bun", "apps/inkflowapp/server.js"]


# Pruner decides what we need → Deps installs it → Builder builds it → Runner runs it.



























# FROM oven/bun:1.4-slim AS builder

# WORKDIR /app

# # ARG DATABASE_URL
# # ARG NEXTAUTH_SECRET
# # ARG NEXTAUTH_URL

# COPY ./package.json ./package.json
# COPY ./bun.lock ./bun.lock
# COPY ./turbo.json ./turbo.json

# COPY ./packages/db/package.json ./packages/db/package.json 
# COPY ./packages/typescript-config/package.json ./packages/typescript-config/package.json 
# COPY ./packages/zodPackage/package.json ./packages/zodPackage/package.json 

# COPY ./packages/db ./packages/db
# COPY ./packages/typescript-config ./packages/typescript-config
# COPY ./packages/zodPackage ./packages/zodPackage

# COPY ./apps/inkflowapp/package.json ./apps/inkflowapp/package.json

# RUN bun install

# COPY ./apps/inkflowapp ./apps/inkflowapp 

# # ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# RUN cd packages/db && bun prisma generate

# RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL --mount=type=secret,id=NEXTAUTH_SECRET,env=NEXTAUTH_SECRET --mount=type=secret,id=NEXTAUTH_URL,env=NEXTAUTH_URL bun run build

# EXPOSE 3000

# CMD ["bun", "run", "start:app"]