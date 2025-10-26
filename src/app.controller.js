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

  const io = new Server(httpServer)

  io.on("connection" , (socket)=>
{
    console.log(socket)
})
}

export default bootstrap;