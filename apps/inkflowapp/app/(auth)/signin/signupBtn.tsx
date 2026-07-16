"use client"
import Link from "next/link";
import { redirect } from "next/navigation";
export const SignupBtn = ()=>{
    return (
         <Link className="cursor-pointer font-bold" href={"/signup"}>Sign up</Link>
    )
}