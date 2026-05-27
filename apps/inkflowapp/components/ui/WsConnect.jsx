"use client"
import { useEffect, useState } from "react"

export const WsConnect = ()=>{
    const [socket, setSocket] = useState();
    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080");
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