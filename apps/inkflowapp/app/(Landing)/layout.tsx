import { Navbar } from "@/components/ui/Landing/navbar"
import { ReactNode } from "react"

const LandingLayout = ({children}: Readonly<{children: ReactNode}>)=>{
    return (
        <section>
            <Navbar/>
            {children}
        </section>
    )
}

export default LandingLayout