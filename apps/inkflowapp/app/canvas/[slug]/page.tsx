import RoomCanvas from "@/components/canvas/RoomCanvas";
import { prisma } from "@repo/db";

const Canvas = async({params}:{
    params: Promise<{
        slug: string
    }>
})=>{
    
    const {slug} = await params;

    const room = await prisma.room.findUnique({
        where:{
            slug:slug
        }
    })

    if(!room){
        return <div>No canvas exist</div>
    }
    return (
        <section>
            <RoomCanvas roomId={room.id}/>
        </section>
    )
}

export default Canvas