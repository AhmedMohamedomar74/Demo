import { testConnection } from "./DB/connection.db.js"
import express from "express"
import path from "node:path"
import dotenv from "dotenv"
import { glopalErrorHandling } from "./utils/glopalErrorHandling.js"
import { Server } from "socket.io"

async function bootstrap() {
  dotenv.config({
    path: path.resolve("./config/dev.env")
  });
  const port = process.env.PORT
  const app = express()
  // DB
  testConnection()

  app.use(express.json())
  app.get('/', (req, res) => {
    res.json({ message: 'Eshare Books is running' });
  });

  app.use(glopalErrorHandling);
  const httpServer = app.listen(port, () => {
    console.log(`Server is running on port = ${port}`);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Configure this properly for production
      methods: ["GET", "POST"]
    }
  })

  io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("sayHi", (data, callback) => {
      console.log({ data })
      callback("Hi from server")
    })
  })
}

export default bootstrap;