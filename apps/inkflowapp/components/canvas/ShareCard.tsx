import { Card } from "../ui/cardWrapper"
import Heading from "../ui/heading"
import { Button } from "../ui/button"

export const ShareCard = ()=>{
    return (
        <div className="hidden sm:block w-full">
            <Card className="w-full ">
                <Heading classname="font-bold text-3xl">Live collaboration</Heading>
                <div className="py-5 pt-10 flex items-center">
                <div className=" font-bold text-sm md:text-lg">Link: </div>
                <div className="">
                    {typeof window!== "undefined"? window.location.href : " "}
                </div>
                </div>
                <div className="w-full">
                    <Button className="w-full">Copy</Button>
                </div>
            </Card>
        </div>
    )
}