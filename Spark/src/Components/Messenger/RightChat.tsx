import { DragEvent, useEffect, useRef, useState } from "react";
import { user_type } from "../../Pages/Messenger";
import { IoTrashBin } from "react-icons/io5";
import axios from "axios";
import { socket } from "../../Services/ConnectSocket";
//import useMessages, { message } from "../../hooks/useMessages";
import { FaPause, FaPlay } from "react-icons/fa";
import getCurrentDateTimeAsString from "../../Services/getTime";
import PullToRefresh from "react-simple-pull-to-refresh";

export interface message{
       message: string,
       pos: string,
       time:string,
       type: string
   }

export default function RightChat({user}:{user:user_type}){

   const [isempty,setisEmpty]=useState<boolean>(false);
   const [inputValue, setInputValue] = useState<string>("");
  // const [Messages,setMessages]=useState<any[]>([]);
   const [stream,setStream]=useState<MediaStream|null>(null);
   const [isRecording,setisrecording]=useState<boolean>(false);
   const [chunks,setChunks]=useState<Blob[]>();
   const [,setBlob]=useState<Blob|null>(null);
   const recording=useRef<MediaRecorder>();
   const [isDrag,setisDrag]=useState<boolean>(false);
   const [base64format,setBase64Format]=useState<string>();
   const [url,setURL]=useState<string>("");
   const [,setVideourl]=useState<string>();
   const [messages,setMessages]=useState<message[]>([]);
   const index=useRef<string>()

   useEffect(()=>{
         socket.on("audiomsg",(obj:message)=>{
            console.log("new audio msg coming");
            console.log(obj);

          obj && setMessages((s)=>{
           
            let count=0
            s.map((e)=>{
               e.type==="text" ?count+=1:count+=2
               console.log(count)
            })
           
            if (count >=8) {
               console.log("Removing oldest message");
               index.current = s[0].time;
               return [...s.slice(1), { ...obj, pos: "receive" }];
           }
           return [...s, { ...obj, pos: "receive" }];
         })
         })

         socket.on("newTextMessage", (msg: message) => {
            console.log("new msg aaya")
            msg && setMessages((s) => {

               let count=0
               s.map((e)=>{
                  e.type==="text" ?count+=1:count+=2
                  console.log(count)
               })
              
                if (count >= 8) {
                    index.current = s[0].time;
                    return [...s.slice(1), { ...msg, pos: "receive" }];
                }
                return [...s, { ...msg, pos: "receive" }];
            });
        });
        

         socket.on("videomsg",(link)=>{
            setVideourl(link);
         })

      return ()=>{
         socket.off("audiomsg");
         socket.off("newTextMessage");
         socket.off("videomsg");
      }
},[])

async function handleRefresh(){
   const res=await axios.post("http://localhost:3000/friend/getFriendChat",{Uid:user.Uid,time:index.current||""},{withCredentials:true});
      console.log(res);
      if(res.data.messages.length>0){
         console.log("coming");

      setMessages((s)=>[...res.data.messages,...s]);
      }
      else{
         setisEmpty(true);
      }
}



useEffect(()=>{
   
   async function getChatFriend() {
      if(user){     
      const res=await axios.post("http://localhost:3000/friend/getFriendChat",{Uid:user.Uid},{withCredentials:true});
      console.log(res);
      setMessages(res.data.messages);
      }
      else{
         return;
      }
   }
   getChatFriend();
},[user])

useEffect(()=>{

   if(url && url.length>0)
      {
         socket.emit("audiomsg",{Uid:user.Uid,url:url})
         setMessages((s)=>[...s,{message:url,pos:"send",time:getCurrentDateTimeAsString(),type:"audio"}])
      }

},[url])

   useEffect(()=>{
      async function  handleUpload() {
         if(base64format){
      const res=await axios.post("http://localhost:3000/cloud",{file:base64format,type:"audio"});
      console.log(res.data.message);
      setURL(res.data.message);
      }
      }
      handleUpload();
     
   },[base64format])

    function handleDrop(e: DragEvent<HTMLDivElement>) {
      e.preventDefault();
      setChunks([]);
      if (stream) {
         stream.getTracks().forEach((track) => {
           track.stop();
         });
         setStream(null); 
       }
   }
   
   function stop(){

    if(recording && recording.current){
       
      recording.current.stop();

   recording.current.onstop = () => {

      const audioBlob:Blob|null=new Blob(chunks, {type:"audio/webm" });
    
      if(audioBlob){
      setBlob(audioBlob);
      }

      setChunks([]);
      setisrecording(false);
      if (stream) {
         stream.getTracks().forEach((track) => {
           track.stop();
         });
         setStream(null); 
       }
       const reader:FileReader=new FileReader();
      
       if(audioBlob){
       reader.readAsDataURL(audioBlob);
         
         reader.onloadend=()=>{
           setBase64Format(typeof(reader.result)==="string"?reader.result:"");
           console.log(reader.result)
         }
      }
}
   
}
   }

function handleMouseDown()
    {     
      setisrecording(true);
      
      navigator.mediaDevices.getUserMedia({
         audio:true,
         video:false,
      })
      .then((stream)=>{
         setStream(stream);
         const recorder=new MediaRecorder(stream,{mimeType:"audio/webm"})
         recording.current=recorder;
         recording.current.start();
       
         const localdata:Blob[]=[];

         recording.current.ondataavailable=(e)=>{
               localdata.push(e.data)
         }
         
         setChunks(localdata);

         // settted all recorded data till here.
   })
}

function handleTextMessage(){
   if(inputValue.length>0){
      socket.emit("newTextMessage",({input:inputValue,Uid:user.Uid}))      

      setMessages((s) => {

         let count=0
         s.map((e)=>{
            e.type==="text" ?count+=1:count+=2
            console.log(count)
         })

         if (count >= 8) {
             index.current = s[0].time;
             return [...s.slice(1), {message:inputValue,pos:"send",time:getCurrentDateTimeAsString(),type:"text"}];
         }
         return[...s,{message:inputValue,pos:"send",time:getCurrentDateTimeAsString(),type:"text"}]
     });
   }
   setInputValue("");
}


   return ( <>
{ 

"Uid" in user && user.Uid.length>0 ?
<div className="flex-1 dark:text-white shadow-post p:2 dark:bg-Dark  col-start-2 col-end-4 sm:p-6 justify-between flex flex-col min-h-[600px]">
   <div className=" flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
      <div className=" relative flex items-center space-x-4">
         <div className="relative">
            <span className={`absolute ${user.isActive?"text-green-500":"text-red-500"} right-0 bottom-0`}>
               <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
               </svg>
            </span>
         <img className="w-[2.5em] h-[2.5em] sm:w-[3em] sm:h-[3em] rounded-full" src={user.avatar} alt="" />
         </div>
         <div className="flex flex-col leading-tight">
            <div className="md:text-2xl mt-1 flex items-center">
               <span className=" text-[1rem]  mr-3">{user.name}</span>
            </div>
         </div>
      </div>
   </div>

   <div id="messages" className=" flex flex-col space-y-4 p-3 overflow-y-auto  scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
   
   <PullToRefresh onRefresh={handleRefresh} canFetchMore={isempty}>
      <div>
   {messages.map((e,i)=>{
      return <Chat key={i} message={e} />
   })}
   </div>
   </PullToRefresh>
   <div className="border-t-2 ml-[0px] border-gray-200 px-4 pt-4 mb-2 sm:mb-0">

<div className="relative z-10 flex min-w-[100px] ml-[0px]">
   <div onDragEnd={()=>setisDrag(false)} onDragStart={()=>{setisrecording(false); setisDrag(true)}} 
   draggable={true} onMouseDown={()=>handleMouseDown()} onMouseUp={()=>stop()}>
   <span className={`absolute inset-y-0 flex items-center `}>
      <button  type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={` h-6 w-6  ${isRecording ? "text-red-500":"dark:text-white text-black"}`}>
            <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
         </svg>
      </button>
   </span>
   </div>
   <input type="text" 
    value={inputValue}
    onChange={(e)=>setInputValue(e.target.value)} className="pl-[3em] w-full focus:outline-none
     focus:placeholder-gray-400 text-black dark:bg-black bg-white dark:text-white placeholder-gray-600
        rounded-md py-3"/>

   <div className="absolute left-[75%]  md:left-[80%] lg:left-[85%] items-center inset-y-0  flex">
      
      {isDrag &&<div  onDrop={(e)=>handleDrop(e)}
       onDragOver={(e)=>e.preventDefault()}><button >
         <IoTrashBin className="mr-[2em] h-[1.5em] w-[1.5em] md:h-[1.7em] md:w-[1.7em] lg:h-[2em] lg:w-[2em]"/></button>
         </div>}

      <button onClick={()=>handleTextMessage()} type="button" className="w-[4em] h-[1.5em] inline-flex items-center justify-center 
      rounded-lg px-[0.4em] oy-[0.5em] sm:px-4 sm:py-3 
      transition duration-500 ease-in-out text-white  transform rotate-
       bg-green-500 hover:bg-blue-400 focus:outline-none">
    <svg xmlns="http://www.w3.org/2000/svg" className= "transform rotate-90 w-[3em] h-[1em]"  viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1
         1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
    </svg>
</button>
   </div>
</div>
</div>
</div>
</div> :<div className="w-[100%] mt-[5em]  col-start-2 col-end-4  h-[100%] ">
   <img src="/images/landing.png"></img>
</div>}

</>

)  
}



function Chat({ message }: { message: message }) {
   const audioref = useRef<HTMLAudioElement | null>(null);
   const [isPlay, setIsPlay] = useState<boolean>(false);

   function handlePlay() {
       audioref.current?.play();
       setIsPlay(true);
   }

   function handlePause() {
        audioref.current?.pause();
       setIsPlay(false);
   }

   const isSend = message.pos === "send";
   const isText = message.type === "text";
   const isAudio = message.type === "audio";
   

   return (
       <div className={`flex my-[1em] items-${isSend ? "end" : "start"} justify-${isSend ? "end" : "start"}`}>
           {isText && (
               <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 order-${isSend ? "1" : "2"} items-${isSend ? "end" : "start"}`}>
                   <div><span className={`px-4 py-2 rounded-lg inline-block rounded-${isSend ? "br" : "bl"}-none bg-${isSend ? "blue-600" : "gray-300"} text-${isSend ? "white" : "gray-600"}`}>{message.message}</span></div>
               </div>
           )}
           {isAudio && (
               <div className={`flex  max-w-[55px] items-${isSend ? "end" : "start"}`}>
                   <audio src={message.message} ref={audioref} controls hidden></audio>
                   <button className={`bg-blue-500 rounded-full w-[4em] p-[1em] flex justify-center items-center ${isSend ? "ml-2" : "mr-2"}`} onClick={isPlay ? handlePause : handlePlay}>
                       {isPlay ? <FaPause /> : <FaPlay />}
                   </button>
               </div>
           )}
       </div>
   );
}
