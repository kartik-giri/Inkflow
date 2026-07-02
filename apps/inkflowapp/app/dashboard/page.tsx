import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard/Dashboard"
const DashboardPage = async()=>{
    const session = await getServerSession(authOptions)

    if(!session){
        redirect("/")
    }
    return (
        <section>
            <Dashboard id={session.user.id} name={session.user.name!} email={session.user.email!}/>
        </section>
    )
}

export default DashboardPage