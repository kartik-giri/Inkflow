"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/cardWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const SigninForm = () => {
  const [isPending, setisPending] = useState(false);
  const [error, setError] = useState<string>()
;
  const signinAction = async (formdata: FormData) => {
    setisPending(true)
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/canvas",
    });
    console.log(res);
    setisPending(false)
    if(res?.error){
        setError("Invalid email or passowrd");
        return
    }
  };

  return (
    <Card>
      <form action={signinAction} className="flex flex-col gap-2">
        <div className=" text-sm min-h-4 max-h-4 text-red-500">
            {error}
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
          <Button
            type="submit"
            disable={isPending}
            className="w-full rounded-md cursor-pointer"
            icon={<ArrowRight />}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
