"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/cardWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export const SigninForm = () => {
    const [isPending, setisPending] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const signinAction = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault() //preveting default browser actions after the event
        setError(undefined)
        setisPending(true)
        const formdata = new FormData(e.currentTarget)

        const email = formdata.get("email") as string;
        const password = formdata.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false, //true will make next-auth redirects to given route before running the whole funciton and this component unmounts
                callbackUrl: "/",
            })

            if (res?.error) {
                setError("Invalid email or passowrd");
                return
            }
            router.push("/")
        } catch (e) {
            setError("Something wend t wrong while signing in");
        } finally {
            setisPending(false)
        }
    }

        return (
            <Card>
                <form onSubmit={signinAction} className="flex flex-col gap-2">
                    <div className=" text-sm min-h-4 max-h-4 text-red-500">
                        {error}
                    </div>

                    <div className=" flex flex-col gap-1.5 ">
                        <Label>Email</Label>
                        <Input name="email" placeholder="Kartikgiri@gmail.com" />
                    </div>

                    <div className=" flex flex-col gap-1.5 ">
                        <Label>Password</Label>
                        <Input type="password" name="password" placeholder="Min, 8 Characters" />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isPending}
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


/*
We should mainly use action={} when using Server Actions
or when we want native form submission behavior.

With action={}, Next.js handles the form submission directly,
similar to a traditional HTML form submit.

React state updates are asynchronous, meaning:

setIsPending(true)

does not instantly re-render the component.

So the form submission process can continue before React
gets time to render the updated state on screen.

That's why "Signing in..." was not appearing.

Using onSubmit runs the handler fully on the client side first.

This gives React time to:
- update state
- re-render the component
- show loading/error UI

before the async login request finishes.
*/
