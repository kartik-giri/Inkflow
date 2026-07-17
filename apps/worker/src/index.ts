import { prisma } from "@repo/db";
import getRedisClient from "@repo/redis";

const main = async () => {
    const redisClient = await getRedisClient();

    //Worker runs forever
    while (true) {
        try {
            const job = await redisClient.brPop(["draw-queue", "erase-queue"], 0) // pop is block until job is pushed in queue. popping out the job from queue, 

            if (!job) {
                continue
            }
            if (job.key === "draw-queue") {
                const parsedJob = JSON.parse(job.element)
                const shapeData = typeof parsedJob.shape === "string"
                    ? JSON.parse(parsedJob.shape)
                    : parsedJob.shape;
                await prisma.element.create({
                    data: {
                        shape: shapeData,
                        creator_id: Number(parsedJob.creatorId),
                        room_id: Number(parsedJob.roomId)
                    }
                })
            }
            else if (job.key === "erase-queue") {
                const parsedJob = JSON.parse(job.element);
                console.log("roomId", parsedJob.roomId);
                console.log(`parsedJob.shape`, parsedJob.shape);

                const shape = typeof parsedJob.shape === "string" ? JSON.parse(parsedJob.shape) : parsedJob.shape
                await prisma.element.deleteMany({
                    where: {
                        room_id: Number(parsedJob.roomId),
                        shape: {
                            // This targets the 'id' key inside the JSON column
                            path: ['id'],
                            equals: shape.id
                        }
                    }
                })
            }
            console.log("Worker finished exucating the job")
        } catch (err) {
            console.error(err)
        }
    }
}

main().catch((err) => {
    console.error("Failed to start worker:", err);
    process.exit(1);
});