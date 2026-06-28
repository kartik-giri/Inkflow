import {createClient} from "redis";


const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (err)=>{
    console.log(`Redis client error: ${err}`)
})

const getRedisClient = async()=>{
    try{
    if(!redisClient.isOpen){
        await redisClient.connect()
    }
    return redisClient
    }catch(err){
        console.log(`Error while connecting redis ${err}`)
        throw err
    }
}

export default getRedisClient

