import {WebSocketServer, WebSocket} from "ws";
import cookie from "cookie";
import { decode } from "next-auth/jwt";
import {prisma} from "@repo/db"


const ws = new WebSocketServer({port:8080}, ()=>{
    console.log("Web socker server is listening on port 8080");
})

const jwtSecret = process.env.NEXTAUTH_SECRET;

const verifyJWT = async(token:string)=>{
    try{
        const verifyToken = await decode({
            token,
            secret: jwtSecret!
        });

        if(!verifyToken || !verifyToken.id){
            return null
        }else{
            return verifyToken.id
        }
        
    }catch(e){
        console.log(`Error while verifying jwt ${e}`)
        return null
    }
}

type User = {
    socket: WebSocket,
    userId: number
}

//users[Room id] -> {{socket,userId}, {socket,userId}};
//One user can be part of multiple rooms. but can't have duplicate entries.
const users = new Map<number, Set<User>>();

ws.on("connection", async (socket, request)=>{
    console.log("cookie from client", request.headers.cookie)
    //Broswer send cookie autmatcally with ws connection request.
    //But cookie is string so we are parsing into object so we can access keys like next-auth.session-token
    const cookies = cookie.parse(
        request.headers.cookie || ""
    )

    const token = cookies["next-auth.session-token"] || cookies["__Secure-next-auth.session-token"];

    if(!token){
        socket.close(4001, "Unauthorized");
        return;
    }

    const userId = await verifyJWT(token);
    console.log("User id", userId)
    if(!userId){
        socket.close(4001, "Unauthorized");
        return;
    }

    const currentUser: User = {
        socket:socket,
        userId: Number(userId)
    }

    /*
    {
      "type":"join-room",
      "roomId": number
    }
    */
    socket.on("message", async(data)=>{
        let parsedMsg;
         try{
            parsedMsg = JSON.parse(data.toString());
         }catch(e){
            return 
         }

        if(parsedMsg.type === "join-room"){
            const roomId = parsedMsg.roomId;
            if(!users.has(roomId)){
                users.set(roomId, new Set())
            }

            users.get(roomId)?.add(currentUser);

            socket.send(JSON.stringify({
                type:"Joined-room",
                roomId : roomId
            }))
        }

        /*
        {
          type:"leave-room",
          roomId: number
        }
        */
        if(parsedMsg.type === "leave-room"){
            const roomId = parsedMsg.roomId
            const room = users.get(roomId);
            if(!room){
                return
            }
            room?.delete(currentUser)
            if(room.size <=0){
                users.delete(roomId)
            }

            socket.send(JSON.stringify({
                type:"Left-room",
                roomId: roomId
            }))
        }

        /*
        {
          type: "draw",
          message: string,
          roomId: number
        }
        */
        if(parsedMsg.type === "draw"){
            const roomId = parsedMsg.roomId;
            const shapeData = parsedMsg.message;

            const room = users.get(roomId);
            if(!room){
                return 
            }

            //Storing shapes in to db
            await prisma.element.create({
                data:{
                    shape: JSON.stringify(shapeData),
                    creator_id: currentUser.userId,
                    room_id: roomId
                }
            })

            room.forEach((user)=>{
                user.socket.send(JSON.stringify({
                    type: "draw",
                    message: shapeData,
                    roomId: roomId
                }))
            })
        }
    })

    socket.on("close" , ()=>{
        users.forEach((room, roomId)=>{
            room.delete(currentUser); //deleting user from every room

            if(room.size <= 0){
                users.delete(roomId); //if roomID maps have no value delete it
            }
        })
    })

    socket.on("error", (err)=>{
        console.log(`Error occured in WS: ${err}`)
    })
})

/*
User logs in with NextAuth
        ↓
Browser stores session cookie
        ↓
Browser opens websocket
        ↓
Cookie automatically sent
        ↓
WS server reads cookie
        ↓
WS server decodes JWT
        ↓
User authenticated
*/