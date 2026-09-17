# Inkflow App

Inkflow is your digital scratchpad for turning messy thoughts into clean, visual diagrams.

## Tech stack
[Turborepo](https://turborepo.dev/): Monorepo management. \
[Bun](https://bun.com/): Fast JavaScript package manager & runtime. \
[Next.js](https://nextjs.org/): Frontend and Backend framework. \
[WebSockets](https://www.npmjs.com/package/ws): Real-time collaboration. \
[PostgreSQL](https://www.postgresql.org/): Database. \
[Prisma](https://www.prisma.io/): ORM for database management. \
[Docker](https://www.docker.com/): Containerized database for development. \
[DockerHub](https://hub.docker.com/): Images registry. \
[GitHub Actions](https://github.com/features/actions): CI/CD pipelines. 
[AWS EC2](https://aws.amazon.com/free/?trk=78c55dff-53b9-4938-8ed3-d071891360dd&sc_channel=ps&trk=78c55dff-53b9-4938-8ed3-d071891360dd&sc_channel=ps&ef_id=CjwKCAjwn67VBhBnEiwAXUIN1SKTMcsGqE14d4zDnNq3bwspymsxjo0GsD-lHPzv5Zu43ugWgnRorxoCtQYQAvD_BwE:G:s&s_kwcid=AL!4422!3!808712755158!e!!g!!aws!23846236475!198027716802&gad_campaignid=23846236475&gbraid=0AAAAADjHtp-sUFaxkkzfDLwCwVNtAig5T&gclid=CjwKCAjwn67VBhBnEiwAXUIN1SKTMcsGqE14d4zDnNq3bwspymsxjo0GsD-lHPzv5Zu43ugWgnRorxoCtQYQAvD_BwE): Public VM.\
[Nginx](https://nginx.org/): Reverse proxy.


## Inkflow Demo

https://github.com/user-attachments/assets/29d73b8d-0638-491a-ba71-3f38e6e4d63f

## Inkflow Architecture

inkflow/
├── apps/                              # Independent applications/services\
│   ├── inkflowapp/                    # Next.js application\
│   │   ├── app/                       # Next.js App Router
│   │   ├── components/                # React UI components
│   │   ├── lib/                       # Application utilities
│   │   └── ...                         # Other Next.js application files
│   │
│   ├── real-time/                     # WebSocket server
│   │   └── src/                       # Real-time collaboration logic
│   │
│   └── worker/                        # Background worker
│       └── src/                       # Redis queue processing & database jobs
│
├── packages/                          # Shared packages used across applications
│   ├── db/                            # Prisma ORM & PostgreSQL database setup
│   │   └── prisma/                    # Prisma schema & migrations
│   │
│   ├── redis/                         # Shared Redis client/configuration
│   │
│   ├── zodPackage/                    # Shared Zod validation schemas
│   │
│   └── typescript-config/             # Shared TypeScript configurations
│
├── docker/                            # Dockerfiles for production services
│   ├── app.Dockerfile                 # Next.js application image
│   ├── ws.Dockerfile                  # WebSocket server image
│   ├── worker.Dockerfile              # Background worker image
│   ├── migrate.Dockerfile             # Database migration image
│   └── ...                            # Other Docker configuration
│
├── .github/
│   └── workflows/                     # GitHub Actions CI/CD workflows
│       └── ...                         # Build, push & deployment workflows
│
├── compose.prod.yml                   # Production Docker Compose configuration
├── docker-compose.yml                  # Local development Docker Compose
│
├── turbo.json                          # Turborepo pipeline configuration
├── package.json                        # Root Bun/Turborepo configuration
├── bun.lock                            # Bun dependency lockfile
│
├── .dockerignore                       # Files excluded from Docker build context
├── .gitignore                           # Git ignored files
│
├── README.md                           # Project documentation






