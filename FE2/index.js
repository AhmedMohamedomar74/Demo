const clientIO = new io("http://localhost:3000")

clientIO.emit("say-hellow" ,  {FE : "Success"})

clientIO.on("say-hellow" , (data) =>
{
    console.log(data)
})

clientIO.on("say-back" , (data)=>
{
    console.log(data)
})