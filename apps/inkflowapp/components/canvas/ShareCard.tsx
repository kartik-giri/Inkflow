"use client"
import { Card } from "../ui/cardWrapper"
import Heading from "../ui/heading"
import { Button } from "../ui/button"
import { useState } from "react"

export const ShareCard = ()=>{
    const [copied, setCopied] = useState<boolean>(false)

    const copyLinkText = async()=>{
        try{
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true)
            setTimeout(()=>{
                setCopied(false)
            },2000)
        }catch(err){
            console.log(`Error ouccured while copiying the link:`, err)
        }
    }
    return (
        <div className="hidden sm:block w-md">
            <Card className="w-full ">
                <Heading classname="font-bold text-3xl">Live collaboration</Heading>
                <div className="py-5 pt-10 flex items-center">
                <div className=" font-bold text-sm md:text-lg">Link: </div>
                <div className="w-full ml-1 bg-orange-100 border rounded-md">
                    <input className="w-full p-2 focus:outline-none" readOnly type="text" value={typeof window!== "undefined"? window.location.href : " "}/>
                    {/* {typeof window!== "undefined"? window.location.href : " "} */}
                    {/* </input> */}
                </div>
                </div>
                <div className="w-full">
                    <Button className="w-full" onClick={copyLinkText}>{copied?"Copied!":"Copy"}</Button>
                </div>
            </Card>
        </div>
    )
}