import express, { json } from "express";
import "dotenv/config";
import AI_res from "./AI_Response/AI_Res.js"
import mongoose, { connect } from "mongoose";
import chatRouter from "./Routes/chats2.js";
import cors from "cors"

const app = express();
const port = 8080;


app.use(express.json())
app.use(cors({
    origin: "*",       // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"] // allowed headers
}))
app.use("/api",chatRouter);


app.listen(port,()=>{
    console.log("Server Started At : ",port);
    ConnectDB();
})


const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.Atlas_KEY);
        console.log("Connect to DB");
    } catch (error) {
        console.log("Error in DB connection \n",error);
    }
}


// app.post("/api",async(req,res)=>{
//     let aires = await AI_res("what is your name");
//     res.send(aires)
// })