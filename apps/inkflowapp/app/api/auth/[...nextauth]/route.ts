import { prisma } from "@repo/db"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

// ✅ Extract and export authOptions separately
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                })

                if (!user) return null

                const checkPassword = await bcrypt.compare(
                    credentials!.password,
                    user.password
                )

                if (!checkPassword) return null

                return {
                    id: user.id.toString(),
                    name: user.username,
                    email: user.email
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string
            return session
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    }
}

// ✅ Pass authOptions to NextAuth
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }





/*
Case 1 — relative URL
tsurl = "/dashboard"
url.startsWith("/") → true
return `${baseUrl}${url}` → "http://localhost:3000/dashboard" ✅

Case 2 — same origin absolute URL
tsurl = "http://localhost:3000/canvas"
url.startsWith("/") → false
new URL(url).origin === baseUrl → "http://localhost:3000" === "http://localhost:3000" → true
return url → "http://localhost:3000/canvas" ✅
*/