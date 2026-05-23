import { ReactNode } from "react";
import { cn } from "@/lib/utils";
export const Input = ({placeholder, className, name}: {placeholder:string, className?:string, name:string})=>{
    return (
        <input name={name} className={cn(`p-2 w-full mb-2 mt-1 text-sm rounded-md border-2 border-black`, className)} type="text" placeholder={placeholder} />
    )
} 