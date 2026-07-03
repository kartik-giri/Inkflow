import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
     //getServerSession takes authOptions for running callbacks.
     const session = await getServerSession(authOptions); //getServerSession() is a server-side function provided by NextAuth.js (v4) used to securely retrieve the current user's session data on the server.

     if (!session || !session.user) {
          return NextResponse.json(
               { error: "Unauthorized" },
               { status: 401 }
          )
     }

     try {
          const body = await req.json(); //parsing the req data.
          
          if (!body.slug || typeof body.slug !== "string") {
               return NextResponse.json(
                    { error: "Slug is required" },
                    { status: 400 }
               );
          }
          
          const room = await prisma.room.create({
               data: {
                    slug: body.slug,
                    adminId: Number(session.user.id)
               }
          })

          revalidatePath("/dashboard")//telling dashboard page that your fetched data/cache data is stailed
          return NextResponse.json(
               { room },
               { status: 200 }
          )
     } catch (err) {
          return NextResponse.json(
               { error: err },
               { status: 400 }
          )
     }
} 