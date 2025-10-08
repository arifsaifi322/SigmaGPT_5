import { useContext, useEffect, useState } from "react"
import Chat from "./Chat"
import "./ChatWindow.css"
import { MyContext } from "./Mycontext";
import {ScaleLoader} from "react-spinners";

export default function ChatWindow(){

    let {prompt,setPrompt,currThreadId,setCurrThreadId,reply,setReply,prevChat,setPrevChat,newChat,setNewChat} = useContext(MyContext);
    let [load,setLoad] = useState(false);

    const getReply = async () =>{
        setLoad(true);
        let url = "https://sigmagpt-5.onrender.com/api/chat";
        const option = {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                message : prompt,
                threadId : currThreadId
            })
        }
        try {
            setNewChat(false);
            let response = await fetch(url,option)
            let jsonRes = await response.json();
            setReply(jsonRes.reply);
            console.log(jsonRes)
            console.log(jsonRes.reply);
            setLoad(false)
        } catch (error) {
            console.log("Error in frontend fetch function : \n",error);
            setLoad(false)
        }
    }

    useEffect(()=>{
        if (prompt && reply) {
            setPrevChat(prevChat => (
                [...prevChat , {role : "user",content : prompt},{role : "assistant" ,content : reply}]
            ))
        }
        setPrompt("");
    },[reply])

    return(
        <div className="chatWindow">
            <div className="navbar">
                <span> SigmaGPT<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span ><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            <Chat/>
            <ScaleLoader color="white" loading={load}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input 
                        type="text" 
                        placeholder="Ask anything" 
                        value={prompt} 
                        onChange={(e)=>setPrompt(e.target.value)}
                        onKeyDown={(e)=>e.key==="Enter" ? getReply() : "" }
                    ></input>
                    <div id="submit" 
                        onClick={getReply} 
                        
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    Sigma-GPT can make mistakes. Check important info. See <u>Cookie Preferences</u>.
                </p>
            </div>
        </div>
    )
}
