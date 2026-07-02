import Demo from "@/components/Landing/demo"
import Features from "@/components/Landing/features"
import HeroSection from "@/components/Landing/heroSection"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
    //  const session = await getServerSession(authOptions); //getServerSession() is a server-side function provided by NextAuth.js (v4) used to securely retrieve the current user's session data on the server.

    //  if (!session || !session.user) {
    //       return NextResponse.json(
    //            { error: "Unauthorized" },
    //            { status: 401 }
    //       )
    //  }
const Landing = async()=>{
    const session = await getServerSession(authOptions);

    if(session?.user){
        redirect("/dashboard")
    }
    return (
        <section>
            <HeroSection/>
            <Demo/>
            <Features/>
        </section>
    )
}

export default Landing