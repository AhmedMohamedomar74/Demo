import { Server } from "socket.io"
import { verify } from "../utils/secuirty/token.services.js"

let ioServer = null
const connectedSokets = new Map()


const disconnection = (Socket) => {
    Socket.on("disconnect", () => {
        const userID = Socket.data.userID
        if (connectedSokets.has(userID)) {
            let existingSockets = connectedSokets.get(userID)
            const findIndex = existingSockets.indexOf(Socket.id)

            existingSockets.splice(findIndex, 1)

            connectedSokets.set(userID, [...existingSockets])
        }
    })
}

const authmiddelware = async (Socket, next) => {
    // console.log()
    const clientToken = Socket.handshake.auth.acessToken
    const client = await verify({ token: clientToken, key: process.env.USER_ACESS_TOKEN_SIGNATURE })
    Socket.data = {
        userID: client._id
    }


    if (connectedSokets.has(client._id)) {
        // If user exists, add the new socket ID to their array
        const existingSockets = connectedSokets.get(client._id)
        connectedSokets.set(client._id, [...existingSockets, Socket.id])
    } else {
        // If user doesn't exist, create a new array with the socket ID
        connectedSokets.set(client._id, [Socket.id])
    }

    console.log({ inside_middelware: true, client })
    next()
}

export const intializer = (httpServer) => {
    ioServer = new Server(httpServer, {
        cors: {
            origin: "*", // Configure this properly for production
        }
    })
    ioServer.use(authmiddelware)
    ioServer.on("connection", (socket) => {
        console.log(socket.id)

        socket.on("say-hellow", (data) => {
            console.log(data)

            console.log(socket.data)
        })
        console.log(connectedSokets)

        disconnection(socket)
    })

    

}

export const getIo = () => {
    try {
        if (null == ioServer) {
            throw new Error("Soket io not intialized", { cause: 500 })
        }
        return ioServer
    } catch (error) {
        console.log(error)
    }
}