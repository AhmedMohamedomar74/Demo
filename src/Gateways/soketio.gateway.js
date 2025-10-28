import { Server } from "socket.io"

let ioServer = null

export const intializer = (httpServer) => {
    ioServer = new Server(httpServer, {
        cors: {
            origin: "*", // Configure this properly for production
        }
    })

    ioServer.on("connection", (socket) => {
        console.log(socket.id)

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