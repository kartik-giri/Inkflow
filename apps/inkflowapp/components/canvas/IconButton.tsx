"use client"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
export const IconButton = ({icon, onClick, activeShape, activeStorke, activeWidth, className}: {icon:ReactNode, onClick:()=>void, activeShape?:boolean, activeStorke?:boolean, activeWidth?:boolean, className?:string})=>{
    return (
        <button className={cn(`${activeShape?"bg-[#E35336] text-white":"bg-white"} ${activeStorke?"border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)]":""}  rounded-md cursor-pointer ${className}`)} onClick={onClick}>
            {icon}
        </button>
    )
}

