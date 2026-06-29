// apps/web/types/next-auth.d.ts

import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string                    // ← adds id
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }

    interface User {
        id: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string                        // ← adds id to token too
    }
}

// declare global → extends global JS scope
// used for things like window, process, globalThis

// declare module → extends a specific npm package's types
// used for extending third-party library types like next-auth