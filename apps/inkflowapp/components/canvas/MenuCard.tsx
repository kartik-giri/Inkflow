import { Home } from "lucide-react"
import { Card } from "../ui/cardWrapper"
import { GithubIcon } from "../icons/github"
import { XTwitterIcon } from "../icons/XTwitterIcon"
import LinkedinIcon from "../icons/linkedin"
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link"

const menuList = [
    {label:"Home", href:"/dashboard", icon:Home},
    {label:"Github", href:"https://github.com/kartik-giri", icon:GithubIcon},
    {label:"X Twitter", href:"https://x.com/0xKartikgiri00",icon:XTwitterIcon },
    {label:"LinkedIn", href:"https://www.linkedin.com/in/kartikgiri00/", icon:LinkedinIcon},
]

export const MenuCard = ()=>{
    return (
        <div>
            <Card className="p-2 rounded-lg">
                <div>
                {menuList.map((item)=>{
                    return <div className="py-3 pl-6 w-45" key={item.label}>
                        <Link  href={item.href} target="_blank">
                           <div className="flex gap-2 mr-4 items-center cursor-pointer py-2 font-medium text-[#1e1e1e] hover:text-[#E35336] border-b border-gray-100 transition-colors">
                            <item.icon className="size-5"/> {item.label}
                           </div>
                        </Link>
                        </div>
                })}
                </div>
                <div className="mt-4 px-2 mb-3">
                    <Button
                    className="w-full rounded-lg"
                     onClick={()=>{
                        signOut({callbackUrl:"/"})
                    }}>Log out</Button>
                </div>
            </Card>
        </div>
    )
}
