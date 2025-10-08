import './App.css'
import ChatWindow from './ChatWindow'
import { MyContext } from './Mycontext';
import Sidebar from './Sidebar'
import { use, useContext, useState } from 'react'
import {v1 as uuidv1} from "uuid";

function App() {
  let [prompt,setPrompt] = useState("");
  let [currThreadId,setCurrThreadId] = useState(uuidv1());
  let [reply,setReply] = useState(null);
  let [prevChat,setPrevChat] = useState([])
  let [newChat,setNewChat] = useState(true);
  let [allThreads,setAllThreads] = useState([]);

  let providerValue = {
    prompt,setPrompt,currThreadId,setCurrThreadId,reply,setReply,newChat,setNewChat,prevChat,setPrevChat,allThreads,setAllThreads
  };


  return (
    <MyContext.Provider value={providerValue}>
      <div className='app'>
        <Sidebar/>
        <ChatWindow/>
      </div>
    </MyContext.Provider>
  )
}

export default App
