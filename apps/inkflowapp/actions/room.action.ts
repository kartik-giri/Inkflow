"use server"
import { prisma } from "@repo/db"
import { revalidatePath } from "next/cache"

const deleteRoom = async(id:number)=>{
    try{
        await prisma.room.delete({
            where:{
                id:id
            }
        })
        revalidatePath("/dashboard") //as we know in client compeonents when state changes compoenents re-redender and in server compoenents wea re fetching data in server component we need to fetch data again so that's why we use revalidatePath() so that next clears the privous cache and marks the cached route as stale. The Server Component runs again when the route is requested again, for example because of: because of router.refresh or navigating to dashboard
    }catch(err){
        console.log(`Error while delteing room`,err)
    }
}

export default deleteRoom

//This function will be run on server underneath it created http request.