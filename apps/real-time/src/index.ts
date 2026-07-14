import { WebSocketServer, WebSocket } from "ws";
import cookie from "cookie";
import { decode } from "next-auth/jwt";
import { prisma } from "@repo/db";
import getRedisClient from "@repo/redis";

const jwtSecret = process.env.NEXTAUTH_SECRET;

const verifyJWT = async (token: string) => {
    try {
        const verifyToken = await decode({
            //NextAuth's decode() does both: decrypt + verify
            token,
            secret: jwtSecret!,
        });

        if (!verifyToken || !verifyToken.id) {
            return null;
        } else {
            return verifyToken.id;
        }
    } catch (e) {
        console.log(`Error while verifying jwt ${e}`);
        return null;
    }
};

type User = {
    socket: WebSocket;
    userId: number;
};

//users[Room id] -> {{socket,userId}, {socket,userId}};
//One user can be part of multiple rooms. but can't have duplicate entries.
const users = new Map<number, Set<User>>();

const main = async () => {
    const redisClient = await getRedisClient();

    const ws = new WebSocketServer(
        { port: 8080, maxPayload: 5 * 1024 * 1024 },
        () => {
            console.log("Web socker server is listening on port 8080");
        },
    );

    ws.on("connection", async (socket, request) => {
        console.log("cookie from client", request.headers.cookie);
        //Broswer send cookie autmatcally with ws connection request.
        //But cookie is string so we are parsing into object so we can access keys like next-auth.session-token
        const cookies = cookie.parse(request.headers.cookie || "");

        const token =
            cookies["next-auth.session-token"] ||
            cookies["__Secure-next-auth.session-token"];

        if (!token) {
            socket.close(4001, "Unauthorized");
            return;
        }

        const userId = await verifyJWT(token);
        console.log("User id", userId);
        if (!userId) {
            socket.close(4001, "Unauthorized");
            return;
        }

        const currentUser: User = {
            socket: socket,
            userId: Number(userId),
        };

        socket.on("message", async (data) => {
            let parsedMsg;
            try {
                parsedMsg = JSON.parse(data.toString()); //converts stringify json into js object
            } catch (e) {
                return;
            }

            /*
           {
            "type":"join-room",
            "roomId": number
           }
           */
            if (parsedMsg.type === "join-room") {
                const roomId = parsedMsg.roomId;
                if (!users.has(roomId)) {
                    users.set(roomId, new Set());
                }

                users.get(roomId)?.add(currentUser);

                socket.send(
                    JSON.stringify({
                        type: "Joined-room",
                        roomId: roomId,
                        payload: {
                            message: `Thanks for joining room ${roomId} `,
                        },
                    }),
                );
            }

            /*
                  {
                    type:"leave-room",
                    roomId: number
                  }
                  */
            if (parsedMsg.type === "leave-room") {
                const roomId = parsedMsg.roomId;
                const userList = users.get(roomId);
                if (!userList) {
                    return;
                }
                userList?.delete(currentUser);
                if (userList.size <= 0) {
                    users.delete(roomId);
                }

                socket.send(
                    JSON.stringify({
                        type: "Left-room",
                        roomId: roomId,
                        payload: {
                            message: `User is deleted from this room ${roomId}`,
                        },
                    }),
                );
            }

            /*
                  {
                    "type": "draw",
                    "message": {"x":10. "y":20},
                    "roomId": 1
                  }
                  */
            if (parsedMsg.type === "draw") {
                const roomId = parsedMsg.roomId;
                const shapeData = parsedMsg.message;

                const userList = users.get(roomId);
                if (!userList || !userList?.has(currentUser)) {
                    return;
                }

                try {
                    //Bradcasting shape to every socket connected to same room except the sender
                    userList.forEach((user) => {
                        if (
                            user.socket.readyState === WebSocket.OPEN &&
                            user.userId !== currentUser.userId
                        ) {
                            user.socket.send(
                                JSON.stringify({
                                    type: "draw",
                                    message: shapeData,
                                    roomId: roomId,
                                }),
                            );
                        }
                    });

                    await redisClient.lPush(
                        "draw-queue",
                        JSON.stringify({
                            roomId,
                            creatorId: currentUser.userId,
                            shape: shapeData,
                        }),
                    );
                } catch (err) {
                    console.log(`Error while bradcasting msg ${err}`);
                    return;
                }
            }
            // {
            //     type:"erase",
            //     message:{
            //         id:string,
            //         shape:Shape,
            //     }
            //     roomId:number
            // }
            if (parsedMsg.type === "erase") {
                const roomId = parsedMsg.roomId;
                const parsedMessage = JSON.parse(parsedMsg.message);
                const deletedShapeId = parsedMessage.id;
                const deletedShape = parsedMessage.shape;

                const userList = users.get(roomId);
                if (!userList || !userList?.has(currentUser)) {
                    return;
                }

                try{
                    userList.forEach((user)=>{
                        if(user.socket.readyState === WebSocket.OPEN && user.userId !== currentUser.userId){
                            user.socket.send(
                                JSON.stringify({
                                    type:"erase",
                                    id:deletedShapeId,
                                })
                            )
                        }
                    })

                    await redisClient.lPush(
                        "erase-queue",
                        JSON.stringify({
                            roomId,
                            shape:JSON.stringify(deletedShape) //stringifying the object`{"id":"2232"}`
                        })
                    )
                }catch(err){
                    console.log(`Error occured while deleting shape ${err}`)
                    return
                }
            }
        });
        //When tihs event occurs call this callback
        socket.on("close", () => {
            users.forEach((userList, roomId) => {
                //value, keys
                userList.delete(currentUser); //deleting user from every room

                if (userList.size <= 0) {
                    users.delete(roomId); //if roomID maps have no value delete it
                }
            });
        });

        socket.on("error", (err) => {
            console.log(`Error occured in WS: ${err}`);
        });
    });
};
main();

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
