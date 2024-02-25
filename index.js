const {app, server} = require('./socket/socket')
const express = require("express");
const cors = require('cors');


const cookieParser = require("cookie-parser")
require('dotenv').config();

// Use cors middleware
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const usersRoutes = require("./routes/users.routes");
const connectToMongoDB = require("./db/connectToMongoDB");


const port = process.env.PORT || 8080

app.use(express.json()) // to parse the incoming request with JSON payloads (from req.body)
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", usersRoutes)

server.listen(port,()=> {
    console.log("Server is working is good..",port)
    connectToMongoDB
})