"use client"
import { redirect } from "next/navigation";
export const SignupBtn = ()=>{
    return (
         <button className="cursor-pointer font-bold" onClick={()=>{
            redirect("/signup")
          }}>Sign up</button>
    )
}