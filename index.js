const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
require('dotenv').config();

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const usersRoutes = require("./routes/users.routes");
const connectToMongoDB = require("./db/connectToMongoDB");


const port = process.env.PORT || 8080

app.use(express.json()) // to parse the incoming request with JSON payloads (from req.body)
app.use(cookieParser())

app.get("/",(req, res)=>{
    res.send("server working on ",port)
})

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", usersRoutes)

app.listen(port,()=> {
    console.log("Server is working is good..",port)
    connectToMongoDB
})