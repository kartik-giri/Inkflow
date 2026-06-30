"use client"
import { cn } from "@/lib/utils"
import {PencilLine } from "lucide-react"
import { useRouter } from "next/navigation"

export const Logo = ()=>{
    const router = useRouter()
    return (
        <div className={cn(`flex justify-center items-center gap-2 cursor-pointer`)} onClick={()=>router.push("/")}>
            <div className={cn( `rounded-lg border border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] text-white p-2 w-10 bg-[#E35336]` )} >
                <PencilLine />
            </div>
            <div className={cn(`font-coming-soon font-bold text-2xl`)}>
               InkFlow 
            </div>
        </div>
    )
}
