// import axios from "axios";
// import { useEffect, useState } from "react";

// export interface message{
//     message: string,
//     pos: string,
//     time:string,
//     type: string
// }

// export default function useMessages(audiomsg:string|undefined,msg:string|undefined,video:string|undefined,receiver_id:string|undefined){

//     const [messages,setMessages]=useState<message[]>([]);
 
//     useEffect(()=>{
//         async function getMessages() {
//            const res=await axios.post("http://localhost:3000/friend/getMessages",{Uid:receiver_id},{withCredentials:true})
//            setMessages(res.data.messages);
//         }
//         getMessages();
//     },[audiomsg,video,msg])

//     return {messages};
// }