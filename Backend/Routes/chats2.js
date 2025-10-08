import express from "express";
import Thread from "../Models/Thread.js";
import openAiResponse from "../AI_Response/AI_Res.js";
const router = express.Router();


// testing - is this able to create a thread in the online DB or not ?

router.post("/test", async(req,res)=>{
    try {
            const thread = new Thread({
            threadId : "t_id_1",
            title : "2-Title for the Thread"
        })
            let response = await thread.save();
            console.log(response);
    } catch (error) {
        console.log("Error in test route in chat.js \n",error);
        res.status(500).json({error : "something's wrong in test route"})
    }
})

// get All threads According to the updated Time

router.get("/thread",async(req,res)=>{
    try {
        const threads = await Thread.find({}).sort({updatedAt : -1});
        res.json(threads);
    } catch (error) {
        console.log("Error in getAll Thread route \n",error);
        res.status(500).json({error : "Failed to Fetch Threads"});
    }
});


// get thread By id - to get all chats 
router.get("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try {
        console.log(threadId)
        const thread = await Thread.findOne({threadId});
        if (!thread) {
            console.log("Thread Not Found");
            res.status(404).json({error : "Thread Not Found"});
        }
        res.json(thread.messages);

    } catch (error) {
        console.log("Error in the get by id Thread Route \n",error);
        res.status(500).json({error : "Failed to Fetch Chats "});
    }
})


// delete The Thread by Id
router.delete("/thread/:threadId",async(req,res)=>{
    try {
        const {threadId} = req.params;
        const deleteThread = await Thread.findOneAndDelete({threadId})
        
        if (!deleteThread) {
            res.status(404).json({error : "Thread Not Found"});
        }

        res.status(200).json({success : "Thread Deleted Successful"});
    } catch (error) {
        console.log("Error in delete route \n",error);
        res.status(500).json({error : "Failed to delete the Thread"});
    }
})


// saving chat in db 

router.post("/chat",async(req,res)=>{
    const {threadId,message} = req.body;

    if (!threadId || !message) {
        res.status(400).json({error : "missing Important Fields"});
    }

    try {
        
        let thread = await Thread.findOne({threadId});
        if (!thread) {
            thread = new Thread({
                threadId,
                title : message,
                messages : [{role :"user", content : message}]
            });
        }else{
            thread.messages.push({role : "user",content : message});
        }

        const assistantReply = await openAiResponse(message);
        thread.messages.push({role : "assistant", content : assistantReply});
        thread.updatedAt = new Date();
        await thread.save()
        res.json({reply : assistantReply})

    } catch (error) {
        console.log("Error in chat route : \n",error)
        res.status(500).json({error : "Something Went Wrong"});
    }
})
export default router;