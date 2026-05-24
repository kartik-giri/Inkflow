"use client"
import { redirect } from "next/navigation";
export const SigninBtn = ()=>{
    return (
         <button className="cursor-pointer font-bold" onClick={()=>{
            redirect("/signin")
          }}>Sign in</button>
    )
}