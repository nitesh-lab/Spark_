import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { FaPause, FaPlay } from "react-icons/fa";
import Loaderpost from "../Common/Loaderpost";
 
export default function VideoModal({setisVideoopen,setVideourl}:{setisVideoopen:React.Dispatch<React.SetStateAction<boolean>>,setVideourl:React.Dispatch<React.SetStateAction<string>>}){

    const videoref=useRef<HTMLVideoElement|null>(null);
    const recordref=useRef<HTMLVideoElement|null>(null);
    const [isRecording,setisrecording]=useState<boolean>(false);
    const mediaref=useRef<MediaRecorder>();
    const [,setVideochunks]=useState<Blob[]>([]);
    const [pauseChunks,setisPausedChunks]=useState<Blob[]>([]);
    const [url,setUrl]=useState<string>();
   
    const [isPaused,setisPaused]=useState<boolean>(false);
    const [loading,setLoading]=useState<boolean>(false)
    // mediarecroder can store chunks actuall yeh pura blob deta h jo tu array m rakh sakta h capture krke ek ek krke.
    // ondatavaialble stop p call hota h and request data p call hota h 
    // curreently resume m issue h like 
    // make currently recorded video=[] //keep pushing in this array
    // once recorded we need user to resume   i.e recording ko false krdo recorder video ref ko hide krdo meaning
    // now again start the recording screen and also tell the mdeiarecorder to start recording.

    useEffect(()=>{

        async function uploadCloud() {
        if(url){
          const res=await axios.post("http://localhost:3000/post/video",{url:url,type:"video"},{withCredentials:true})
        setVideourl(res.data.url)
        setisVideoopen(false);
        }
        else{
            return;
        }
    }
    uploadCloud();
    },[url])

    useEffect(()=>{
        if(pauseChunks.length>0){
        const blob = new Blob(pauseChunks, { type: "video/webm" }); 
        const url = URL.createObjectURL(blob); 
        (recordref.current)!.src = url; 
        (recordref.current)!.hidden=false;
        console.log(url);
        }

    },[pauseChunks])


  async  function handleStart(){

     if(mediaref.current?.state==="paused"){
        console.log(" hanld resume line 52")  
             setisrecording(true);
             mediaref.current?.resume();
             mediaref.current.stream.getAudioTracks().forEach(track => track.enabled = true);  // to start again capture audio from bg when
             // video is resumed
             (recordref.current)!.hidden=true;
             (recordref.current)!.src="";
             (videoref.current)!.play();
             setisPaused(false); // Set isPaused state to false
         }
         else{


    console.log("handle start called")
    setisrecording(true);

    const audioConstraints = { audio: true, video: false };

    const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);

    const videoConstraints = { audio: false, video: { facingMode: "user" } };

    const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

    const combinedStream:MediaStream=new MediaStream([...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()]);
    
    if(videoref && videoref.current && "srcObject" in videoref.current){
   
    videoref.current.srcObject = combinedStream;
    videoref.current.play(); // Start playback
    }
       const media=new MediaRecorder(combinedStream,{mimeType:"video/webm"});

        mediaref.current=media;

        const localVideoChunks:Blob[]=[];

        mediaref.current.ondataavailable = (event) => {

            if(mediaref.current?.state=="paused"){  
                setisPausedChunks((s)=>[...s,event.data])
                return;
            }
          if (typeof event.data === "undefined" || event.data.size === 0) return;
          console.log(event.data)
          localVideoChunks.push(event.data);
        };
        setVideochunks(localVideoChunks);
    
        mediaref.current.start();
    }
}

    function handleDiscard(){
       
        mediaref.current?.stop();

        setVideochunks([]);
        setisPausedChunks([]);

        const tracks = mediaref.current?.stream.getTracks();
        
        tracks && tracks.forEach(track => track.stop());
        mediaref.current=undefined;
        setUrl("");
        setisrecording(false);
        setisPaused(false);
        videoref.current=null;
        setisVideoopen(false);
    }

    function handleStop() {
        console.log("Stopping recording...");
    
        setisrecording(false);
        setLoading(true)
        if (mediaref && mediaref.current) {
            mediaref.current.stop();
    
            mediaref.current.onstop = () => {
                console.log("Recording stopped.");
                
                const videoBlob = new Blob(pauseChunks, { type: "video/webm" });  //creating a single blob from all paused chunks.
    
                const reader = new FileReader();
                reader.readAsDataURL(videoBlob);
                reader.onloadend = () => {
                    setUrl(typeof(reader.result) === "string" ? reader.result : "");
                };
    
                const tracks = mediaref.current?.stream.getTracks();
    
                tracks && tracks.forEach(track => track.stop());
    
                if (videoref && videoref.current) {
                    videoref.current.srcObject = null;
                }
            };
        } else {
            console.log("No MediaRecorder instance found.");
        }
    }

    function handlePause() {

        console.log("clciked");
        if (videoref && videoref.current && recordref.current) {
            console.log("handle pause at 117");

            if (!videoref.current.paused) { // try to discard that videored somehow
            console.log("120")

                if (mediaref.current && "pause" in mediaref.current && "onpause" in mediaref.current) { 
                    mediaref.current.pause(); 
                    mediaref.current.stream.getAudioTracks().forEach(track => track.enabled = false); // to stop capturing audio when video is paused. 
                    setisPaused(true);
                    setisrecording(false);

                mediaref.current.onpause=()=>{
            
                   (mediaref.current)!.requestData();
                }
            }

            } 
        }      
    
    }
    

    return(<>
    
    <div className="flex flex-col fixed z-50 inset-0 rounded-lg top-[2%] bottom-[2%] md:grid md:grid-rows-6 md:grid-cols-1 left-[10%] right-[10%] w-[80%] bg-[#242526]">
        
    <div className="md:row-start-1 md:order-3  order-2 border-white border-2 md:row-end-6">
    {!isRecording && !isPaused && <div className="flex justify-center items-center mt-[1em]">
        <img src="/images/landing.png" alt="" />
    </div>}
        
        <video className="w-[100%] h-[100%]" ref={videoref}  controls={isPaused} hidden={!isRecording} />
         <video className="w-[100%] h-[100%]" ref={recordref} hidden={true} controls  />
    </div>


  <div className="flex   flex-col order-1  md:order-3 justify-between gap-[0.5em] px-4 py-2 md:row-start-1 md:row-end-2">
   <button className="text-white rounded-lg ml-[0.1em] font-semibold text-[0.8rem]  md:text-[1rem] w-[5em] h-[2em] sm:w-[3em] sm:h-[2em]  md:w-[5em] md:h-[3em] text-center   px-[1em] bg-green-500 py-[0.2em] hover:bg-green-600" onClick={()=>handleStop()}>Post</button>
   
   <button onClick={()=>handleDiscard()} className="text-white rounded-lg ml-[0.1em]  font-semibold text-[0.8rem] md:text-[1rem] w-[5em] h-[2em] md:w-[5em] md:h-[3em]    px-[1em] bg-red-500 py-[0.2em] hover:bg-red-600">
  Discard
</button>
</div>

   { loading ? <Loaderpost custom="order-10"/>: <div className="flex  justify-center order-5 gap-[2em] md:row-start-6 md:row-end-7">
    {isRecording  && (
        <FaPause 
            className="mt-[1em] h-[2em]  text-white w-[2em] md:w-[3em] m:h-[3em] hover:cursor-pointer" 
            onClick={()=>handlePause()} 
        />
    )}
    {!isRecording &&  (
        <FaPlay 
            onClick={()=>handleStart()} 
            className="hover:cursor-pointer text-white h-[2em] mt-[1em] w-[2em] md:w-[3em] m:h-[3em]" 
        />
    )}
</div>}

</div>

</>
    )
}