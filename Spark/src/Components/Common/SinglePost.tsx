import { useEffect, useRef, useState } from "react";
import { FaComment, FaDownload, FaHeart, FaPause } from "react-icons/fa";
import { post } from "../../Pages/Profile";
import CommentSection from "./CommentSection";
import axios from "axios";

export default function SinglePost({ uid,element }: {uid:string, element: post }) {

    const [showFull,setShowFull]=useState<boolean>(false);
    const videoref=useRef<HTMLVideoElement|null>(null);
    const [isplaying,setisPlaying]=useState(false);
    const [showComment,SetshowComment]=useState<boolean>(false);
    const [canlike,setcanlike]=useState<boolean>(false)    

    useEffect(()=>{
       
        async function CheckLike() {  
            if(uid && element.post_id){ // receiver id and post id
           const data=await axios.post("https://spark-9j9e.onrender.com/api/post/like",{"Uid":uid,"post_id":element.post_id},{withCredentials:true});
                setcanlike(data.data.status)
        }else{
            return
        }
    }

        CheckLike()
    },[element.post_id,uid])

    function handleComment(){

        SetshowComment(true);
        setisPlaying(true);

    }

    function handleStop(){
      setShowFull(false)
    }

    function handleClick(){
      setShowFull(true);
    }
  
    function Play(){
      console.log("clciked")
      videoref.current?.play();
      setisPlaying(true);
    }
  
     function handleDownload(){
     console.log("coming download");
  
      const video = videoref.current;
      if (video) {
        const a = document.createElement('a');
        a.href = video.src;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    function handleDownloadImg() {
      console.log("coming download");
     
      const a = document.createElement('a');
      a.href = element.photo || "";
      a.download = 'downloaded_image'; // Set a default filename if needed
      a.target = '_blank'; // Open the download in a new tab/window
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }
  
    if(showFull){
  
      return <>
       
       { element.type==="video"?

  <div className="top-[0] flex gap-[1em]  z-[1000] left-[0] fixed h-[95vh] w-[100vw] bg-blue-100">
<div className="text-white flex justify-center items-center h-[100vh] w-[100vw]">

  <div className="w-[100vw] md:w-[50vw] bg-gray-800 my-[2vh] h-[100vh]   rounded-lg gap-[1em] grid grid-rows-5 grid-cols-4">
  {showComment && <CommentSection id={element.post_id} SetshowComment={SetshowComment}/>}

<div className="relative   flex  justify-center items-center row-start-1 row-end-6 col-start-1 col-end-4">
<div>
  {!isplaying &&<button   onClick={()=>Play()} className="absolute left-[48%] top-[50%] z-[1000]
   bg-blue-500 p-[1em] rounded-full "><FaPause className="text-white"/></button>}

  <video src={element.photo} ref={videoref} controls={isplaying}  className="rounded-lg ml-[2%] 
  w-[98%] md:h-[100%] h-[50%] md:w-[100%] " >
  </video>
  </div>
</div>

<div className="flex justify-center items-center row-start-1 row-end-2 col-start-4 col-end-5">
<button onClick={() => handleStop()} className=" text-white bg-red-500 px-3 py-1 rounded-md">
      Close
    </button>
</div>
<div className=" ml-[1em] flex flex-col gap-[6em] justify-center row-start-2 row-end-6 col-start-4 col-end-5">

<div className="flex flex-col items-center gap-[0.2em]"><div><FaHeart className={`hover:cursor-pointer h-[2em] w-[2em] 
${canlike? "text-white":"text-red-500" }`}/></div>
<div> <p>{element.like ? element.like.length:0}</p></div>
</div>

<div className="flex flex-col items-center gap-[0.2em]">
  <div onClick={()=>handleComment()}><FaComment  className="hover:cursor-pointer h-[2em] w-[2em] text-white"/></div>
<div> <p>{element.comment ? element.comment.length:0}</p></div>

</div>

<div className="flex flex-col items-center">
  <div>
  <FaDownload onClick={()=>handleDownload()} className="hover:cursor-pointer h-[2em] w-[2em] text-white"/>
</div>
</div>
</div>

</div>

</div>


</div> 

:
  <div className="top-[0] flex gap-[1em]  z-[1000] left-[0] fixed h-[100vh] w-[100vw] bg-blue-100">
  
      <div className="flex text-white justify-center items-center h-[100vh] w-[100vw]">
  
        <div className="w-[100vw] md:w-[50vw] bg-gray-800 my-[2vh] h-[96vh]   rounded-lg gap-[1em] grid grid-rows-3 grid-cols-4">
  
      <div className="relative   flex justify-center items-center row-start-1 row-end-4 col-start-1 col-end-4">
       
        <img src={element.photo} alt="" className=" ml-[2%] w-[98%] md:h-[60%] h-[50%] md:w-[80%] md:mx-[10%]" />
      </div>
      
      <div className=" ml-[1em] flex flex-col gap-[6em] justify-center row-start-1 row-end-4 col-start-4 col-end-5">
      
      <div className="flex flex-col items-center gap-[0.2em]"><div><FaHeart className={`hover:cursor-pointer h-[2em] w-[2em] 
      ${canlike? "text-white":"text-red-500" }`}/></div>
      <div> <p>{element.like ? element.like.length:0}</p></div>
      </div>

      <div className="flex flex-col items-center gap-[0.2em]">
        <div onClick={()=>handleComment()}><FaComment  className="hover:cursor-pointer h-[2em] w-[2em] text-white"/></div>
     <div> <p>{element.comment ? element.comment.length:0}</p></div>
  
     </div>
      
      <div className="flex flex-col items-center">
        <div>
        <FaDownload onClick={()=>handleDownloadImg()} className="hover:cursor-pointer h-[2em] w-[2em] text-white"/>
      </div>
      </div>
      </div>
  
      </div>
     
      </div>
  
  
  </div>
    
    }
      </>
    }
  
  return (
      element.type === "photo" ? (
        <div onClick={()=>handleClick()} className="hover:cursor-pointer relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm">
          <div className="h-auto overflow-hidden">
            <div className="h-44 overflow-hidden relative">
              <img src={element.photo} alt="" />
            </div>
          </div>
          <div className="bg-white py-4 px-3">
            <h3 className="text-xs mb-2 font-medium">{element.text}</h3>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
               {element.posted}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={()=>handleClick()} className="hover:cursor-pointer relative flex flex-col 
        shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm">
          <div className="h-auto overflow-hidden">
            <div className="h-44 overflow-hidden relative">
              <video src={element.photo} className="w-[100%]" ></video>
            </div>
          </div>
          <div className="bg-white py-4 px-3">
            <h3 className="text-xs mb-2 font-medium">{element.text}</h3>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
               {element.posted}
              </p>
            </div>
          </div>
        </div>
        
      )
    );
  }
  
  