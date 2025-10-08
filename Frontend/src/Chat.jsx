import { useContext, useEffect, useState } from "react"
import { MyContext } from "./Mycontext"
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import "./Chat.css"
export default function Chat(){
    let {newChat,setNewChat,reply,prevChat} = useContext(MyContext);
    let [latestReply,setLatestReply] = useState(null);
    
    useEffect(()=>{
        
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChat?.length) {
            return;
        }

        const content = reply.split(" ");

        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0,idx+1).join(" "))
            idx++;

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 10);

        return ()=> clearInterval(interval);

    },[prevChat,reply])
    return(<>
            <div className="outterChats">
                {newChat &&<h1>Where Should We Begin?</h1>}
                <div className="chats">

                    {prevChat?.slice(0,-1).map((chat,idx)=>
                        <div className={chat.role ==="user" ? "userDiv" : "gptDiv"} key={idx}>
                            <div className={chat.role === "user" ? "userMessage" : "gptMessage"} key={idx}>
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            </div>
                        </div>
                    )} 
                
                
                {
                    prevChat.length > 0 && latestReply !== null &&

                    <div className="gptDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
                }
                {
                    prevChat.length > 0 && latestReply === null &&

                    <div className="gptDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChat[prevChat.length-1].content}</ReactMarkdown>
                    </div>
                }

            </div>
            </div>
        </>
    )
}