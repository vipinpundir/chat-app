const express = require("express")
const app = express()
require('dotenv').config();

const authRoutes = require("./routes/auth.routes");
const connectToMongoDB = require("./db/connectToMongoDB");


const port = process.env.PORT || 8080

app.use(express.json()) // to parse the incoming request with JSON payloads (from req.body)

app.get("/",(req, res)=>{
    res.send("server working on ",port)
})

app.use("/api/auth", authRoutes)

app.listen(port,()=> {
    console.log("Server is working is good..",port)
    connectToMongoDB
})