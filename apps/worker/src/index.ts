import { prisma } from "@repo/db";
import getRedisClient from "@repo/redis";

const main = async ()=>{
    const redisClient = await getRedisClient();
    
    //Worker runs forever
    while(true){
        try{
        const job = await redisClient.brPop("draw-queue", 0) // pop is block until job is pushed in queue. popping out the job from queue, 

        if(!job){
            continue
        }

        const parsedJob = JSON.parse(job.element)
       console.log("Worker is exucating the job")
        await prisma.element.create({
            data:{
                shape: parsedJob.shape, //JSON.stringify covnverts json in to string
                creator_id: parsedJob.creatorId,
                room_id: parsedJob.roomId
            }
        })
    }catch(err){
        console.error(err)
    }
    }
}

main().catch((err) => {
    console.error("Failed to start worker:", err);
    process.exit(1);
});