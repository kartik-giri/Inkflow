"use client"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
export const IconButton = ({icon, onClick, active}: {icon:ReactNode, onClick:()=>void, active:boolean})=>{
    return (
        <button className={cn(`${active?"bg-[#E35336] text-white":"bg-white"} p-2 rounded-md cursor-pointer `)} onClick={onClick}>
            {icon}
        </button>
    )
}

