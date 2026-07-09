"use server"

import { prisma } from "@repo/db"

export const getShapesAction = async(roomId:number)=>{
    try{
        const shapes = await prisma.element.findMany({
            where:{
                room_id:roomId
            }
        })

        const allShapes = shapes.map((element)=>{
            return JSON.parse(element.shape as string)
        })

        return allShapes
    }catch(err){
        console.log(err);
        return []
    }
}