"use client"
import { useEffect, useState } from "react"
import Canvas from "./Canvas"

const RoomCanvas = ({roomId}: {roomId:number})=>{
    const [socket, setSocket] = useState<WebSocket| null>(null)
    
    useEffect(()=>{
         const ws = new WebSocket("wss://inkflow.click/ws/") //cooke will go automatically with every subsequent http request
        // const ws = new WebSocket(process.env.WEBSOCKET_URL!) //cooke will go automatically with every subsequent http request
        
        ws.onopen = ()=>{
            setSocket(ws);
            ws.send(JSON.stringify({ //sending msg to socket to join room
                type: "join-room",
                roomId: roomId
            }))
        }

        return ()=>{
            ws.close() // closing websocket connection
        }

    },[])

    if(!socket){
        return <div>
            Connecting to server...
        </div>
    }
    return (
        <section>
            <Canvas roomId={roomId} socket={socket}/>
        </section>
    )
}

export default RoomCanvas