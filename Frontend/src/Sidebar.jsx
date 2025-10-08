import { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "./Mycontext";
import {v1 as uuidv1} from "uuid";
export default function Sidebar(){

    let {
            prompt,setPrompt,currThreadId,setCurrThreadId,reply,setReply,newChat,setNewChat,prevChat,setPrevChat,allThreads,setAllThreads
        
        } = useContext(MyContext);
    
    const getAllThreads = async ()=>{
        try {
        let url = "http://localhost:8080/api/thread";

        const response = await fetch(url);
        let res = await response.json();

        const filteredData = res.map(thread => ({threadId : thread.threadId, title : thread.title}))
        
        setAllThreads(filteredData);

    } catch (error) {
        console.log("Error in the Fetch function in sidebar : \n",error);
    }
    }

    useEffect(()=>{
        getAllThreads();
    },[currThreadId,reply]);

    function createNewChat(){
        setNewChat(true)
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChat([]);
    }

    async function changeThread(newThreadId){
        setCurrThreadId(newThreadId);
        try {
            const res = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const jsonRes = await res.json();
            setPrevChat(jsonRes);
            setReply(null)
            console.log(jsonRes);

        } catch (error) {
            console.log("Error in changeThread f() in sidebar : \n",error);
        }
    }

    async function deleteThread(newThreadId){
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`,{method : "DELETE"});
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== newThreadId));
            if (newThreadId === currThreadId) {
                createNewChat();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" className="logo" alt="GPT_logo"></img>
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread,idx)=>(
                        <li key={idx} onClick={(e)=>changeThread(thread.threadId)}>{thread.title}
                            <i className="fa-solid fa-trash" 
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    deleteThread(thread.threadId)
                                    }
                                }>
                            </i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>by Apna College &hearts;</p>
            </div>
        </section>
    )
}