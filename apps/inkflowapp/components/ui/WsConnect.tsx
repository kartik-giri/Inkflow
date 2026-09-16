"use client"
import { useEffect, useState } from "react"

export const WsConnect = ()=>{
    const [socket, setSocket] = useState<WebSocket | null>();
    useEffect(()=>{
        const ws = new WebSocket("wss://inkflow.click/ws/") //cooke will go automatically with every subsequent http request
        // const ws = new WebSocket(process.env.WEBSOCKET_URL!)
        setSocket(ws);

        ws.onopen= ()=>{
            console.log("connected")
        }

        ws.onclose= ()=>{
            console.log("Closed")
        }
    },[])

    return(
        <>
        </>
    )
}