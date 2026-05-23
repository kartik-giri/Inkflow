import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export const Label = ({children,className}: {children:ReactNode,className?:string})=>{
    return(
        <label className={cn(`text-md font-bold text-gray-700`, className)}>
            {children}
        </label>
    )
}