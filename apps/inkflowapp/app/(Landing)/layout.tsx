import Footer from "@/components/Landing/footer"
import { Navbar } from "@/components/Landing/navbar"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const LandingLayout = ({children}: Readonly<{children: ReactNode}>)=>{
    return (
        <section>
            <Navbar/>
            <main className={cn(`pt-16`)}>
                {children}
            </main>
            <section id="connect">
                <Footer/>
            </section>
        </section>
    )
}

export default LandingLayout