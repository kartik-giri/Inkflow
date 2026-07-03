"use client"
import { Room } from "./Dashboard"
import Link from "next/link"
import { cn } from "@/lib/utils"
import deleteRoom from "@/actions/room.action"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
const Table = ({rooms}:{rooms:Room[]})=>{

    const [deletingId, setDeletingId] = useState<number| null>(null)
    const router = useRouter()
    return(
        <div className={cn(`px-4 lg:px-27 pt-20 pb-20 `)}>
        <table className="w-full border-collapse">
            <thead>
                <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4 hidden md:table-cell">Created</th>
                    <th className="text-left p-4 hidden md:table-cell" >Last edited</th>
                    <th className="text-left p-4"></th>
                    <th className="text-left p-4"></th>
                </tr>
            </thead>

            <tbody>
                {rooms.map(room => (
                    <tr
                        key={room.id}
                        className="border-b hover:bg-neutral-50"
                    >
                        <td className="p-4 font-medium">
                            {room.slug}
                        </td>

                        <td className="p-4 hidden md:table-cell">
                            {room.created_at.toLocaleDateString("en-IN")}
                        </td>

                        <td className="p-4 hidden md:table-cell">
                            {room.updated_at.toLocaleDateString("en-IN")}
                        </td>

                        <td className="p-4">
                            <Link
                                href={`/canvas/${room.slug}`}
                                className="text-blue-600"
                            >
                                <Button className="text-sm font-semibold">Open</Button>
                            </Link>
                        </td>
                        <td>
                            {/* <button className="text-red-700 cursor-pointer" disabled={isloading} onClick={async()=>{
                                setLoading(true)
                                await deleteRoom(Number(room.id))
                                router.refresh()
                                setLoading(false)
                            }}>
                                {isloading? "Deleting...": "Delete"}
                            </button> */}
                            <Button className="bg-white text-red-700 text-sm font-semibold" disabled={deletingId === room.id} onclick={async()=>{
                                setDeletingId(room.id)
                                await deleteRoom(Number(room.id))
                                router.refresh()
                                setDeletingId(null)
                            }}>{deletingId === room.id ?"Deleting":"Delete"}</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
       </div>
    )
}

export default Table