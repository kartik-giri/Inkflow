"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/cardWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {ArrowRight} from "lucide-react"
import { signUpAction } from "./action";
export const SignupForm = ()=>{
    return (
        <Card>
        <form action=""  className="flex flex-col gap-2">
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
        <Button  className="w-full rounded-md cursor-pointer" icon={<ArrowRight/>}>Sign up</Button>
      </div>
      </form>
      </Card> 
    )
} 