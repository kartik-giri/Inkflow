import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const Heading = ({ children, classname }: { children: ReactNode, classname:string }) => {
    return (
        <section className={cn(`font-coming-soon text-4xl font-bold mt-3 ${classname}`)}>
            <span className={cn("relative inline-block")}>
                {children}
                <svg
                    className={cn("absolute left-0 -bottom-6 w-full")}
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    height="12"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 6 Q 37 1, 75 6 T 150 6 T 225 6 T 300 6"
                        fill="none"
                        stroke="#ffc033"
                        strokeWidth="4"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDashoffset="0"
                         strokeDasharray="1 1"
                    />
                    {/* <path d="M0 6 Q 37 1, 75 6 T 150 6 T 225 6 T 300 6" fill="none" stroke="#ffc033" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dashoffset="0" stroke-dasharray="1 1"></path> */}
                </svg>
            </span>
        </section>
    )
}

export default Heading
