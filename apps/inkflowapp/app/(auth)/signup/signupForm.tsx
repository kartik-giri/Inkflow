"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/cardWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {ArrowRight} from "lucide-react"
import { signUpAction } from "./action";
import { useActionState } from "react";

export const SignupForm = ()=>{
  const [state,signupAction, isPending] = useActionState(signUpAction,undefined)
    
  return (
        <Card>
        <form action={signupAction} className="flex flex-col gap-2">
        
        {state?.error && (
          <p className=" text-red-500 text-sm">{state.error}</p>
        )}
        {state?.success &&(
          <p className="text-green-500 text-sm">{state.success}</p>
        )}

        <div className=" flex flex-col gap-1.5 ">
          <Label>Full name</Label>
          <Input name="username" placeholder="Kartik giri" />
        </div>

        <div className=" flex flex-col gap-1.5 ">
          <Label>Email</Label>
          <Input name="email" placeholder="Kartikgiri@gmail.com" />
        </div>

        <div className=" flex flex-col gap-1.5 ">
          <Label>Password</Label>
          <Input name="password" placeholder="Min, 8 Characters" />
        </div>

        <div>
        <Button type="submit" disable={isPending} className="w-full rounded-md cursor-pointer" icon={<ArrowRight/>}>{isPending? "Creating account...":"Sign up"}</Button>
      </div>
      
      </form>
      </Card> 
    )
} 