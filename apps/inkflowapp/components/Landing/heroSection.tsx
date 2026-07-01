"use client"
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { GithubIcon } from "@/components/icons/github";
import { redirect } from "next/navigation";
// import Router from "next/navigation";

const HeroSection = ()=>{
    return (
        <section className={cn( "flex flex-col justify-center items-center pt-40 pb-65",
    // "bg-[radial-gradient(ellipse_at_center,#E3533620_0%,#ffffff_100%)]",
    "bg-[radial-gradient(#1e1e1e15_1px,transparent_2px)] [background-size:24px_24px]",)}>
        <div className={cn(`flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_center,#E3533620_0%,#ffffff_70%)] `)}>
            <h1 className={cn(`font-coming-soon text-5xl font-bold md:text-8xl`)}>
                <div>Draw ideas </div>
               <div>ship faster.</div>
            </h1>
            <div className={cn(`w-6/12  text-center mt-6 font-semibold text-gray-500 md:text-xl`)}>
                <p>
                  The hand-drawn whiteboard built for Devs. Sketch, collaborate, and present all in one place.  
                </p>
            </div>

            <div className={cn(`flex gap-5 pt-6`)}>
                <Button className="text-sm p-2 md:px-6 py-2">Start Drawing Free</Button>
                <a href="https://github.com/kartik-giri/Inkflow" target="_blank">
                    <Button className="text-sm p-2 md:px-6 py-2">{<GithubIcon className="size-5"/>}View on Github</Button>
                </a>
                
            </div>
            </div>
        </section>
    )
}

export default HeroSection