import { Logo } from "@/components/ui/logo";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const AuthLayout = ({children}: Readonly<{children: ReactNode}>)=>{
    return (
        <section className={cn(``)} >
            <div className={cn(`flex justify-center mt-10`)}>
                <Logo/>
            </div>
            {children}
        </section>
    )
}

export default AuthLayout