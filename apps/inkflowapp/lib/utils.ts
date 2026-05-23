import {clsx, type ClassValue} from "clsx";
import { twMerge } from "tailwind-merge";

//All the tailwind classes becomes array in inputs and than passed in to clsx so that we can write conditions and than pass into twMerge so that conflict resolves.
export const cn = (...inputs:ClassValue[])=>{
    return twMerge(clsx(inputs))
}

/*
cn("rounded-xl", isActive && "bg-blue-500", "rounded-sm")
 
// Step 1 — inputs array
["rounded-xl", false, "rounded-sm"]

// Step 2 — clsx removes falsy values and joins
"rounded-xl rounded-sm"

// Step 3 — twMerge resolves conflicts
"rounded-sm" ✅
*/