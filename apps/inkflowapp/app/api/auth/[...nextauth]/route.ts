import { prisma } from "@repo/db";
import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
           
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "kartik giri" },
                password: { label: "password", type: "password"}
            },
            async authorize(credentials, req) {

                const user = await prisma.user.findUnique({
                    where:{
                        email:credentials?.email
                    }
                })

                if(!user){
                    return null
                }

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        id:user.id.toString(),
                        name: user.username,
                        email:user.email
                    }
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"/signin"
    },
    //Where should the user be sent after login.
    callbacks:{
    async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  } 
    }

})

export { handler as POST, handler as GET }