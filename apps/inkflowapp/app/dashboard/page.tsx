import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard/Dashboard"
import { prisma } from "@repo/db"

const DashboardPage = async()=>{
    const session = await getServerSession(authOptions)

    if(!session){
        redirect("/")
    }

    const rooms = await prisma.room.findMany({
        where:{
            adminId: Number(session.user.id)
        },
        orderBy:{ //return the latest edited canvas on top.
            updated_at:"desc"
        }
        })

    return (
        <section>
            <Dashboard id={session.user.id} name={session.user.name!} email={session.user.email!} rooms={rooms}/>
        </section>
    )
}

export default DashboardPage