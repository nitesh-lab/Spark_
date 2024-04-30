import { RiImageAddLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { useState } from "react";
import { UseParent } from "../../Context/ParentProvider";
import axios from "axios";
import { user_data } from "../../Context/ParentProvider";
import Loaderpost from "../Common/Loaderpost";

export default function Modal({ setmodal,videourl,setVideourl}: { setmodal: React.Dispatch<React.SetStateAction<boolean>>,videourl:string,setVideourl:React.Dispatch<React.SetStateAction<string>> }) {
    
    const { user}:{user:user_data|object,isDark:boolean} = UseParent();
    const [postContent, setPostContent] = useState(""); // State for post content
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file
    const [loading,setloading]=useState<boolean>(false)

    async function handlePost() {
       
        if(videourl){
            if("Uid" in user){
                setloading(true);
       await axios.post("http://localhost:3000/user/post",{"Uid":user.Uid,"text":postContent,"video":videourl},{withCredentials:true});
                setloading(false)
                setPostContent("");
            setSelectedFile(null);
            setVideourl("");
            setmodal(false);
           
        }
        }
        else{
        const formData = new FormData();
        if("Uid" in user){
        formData.append('Uid',user.Uid);
        formData.append('text', postContent);
        formData.append('photo', selectedFile ? selectedFile:"");
        }
    
        try {
            setloading(true);
            await axios.post("http://localhost:3000/user/post", formData,{withCredentials:true});
            setloading(false);
          
            setPostContent("");
            setSelectedFile(null);
            setVideourl("");
            setmodal(false);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    }


    return (
        <>
            <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-[90%] max-w-xl mx-auto overflow-hidden
                 bg-blue-50 rounded-lg sm:max-h-full sm:w-full">
         <div className="flex justify-end px-4 pt-4">
                        <button onClick={() => {setmodal(false);setVideourl("")}} 
                        className=" cus:outline-none">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="m-8 sm:my-20">
                        <div className="mb-8 flex gap-[1em]">
                            <img className="w-[3em] h-[3em] rounded-full" src="/images/bg.png" alt="Profile" />
                            <p className="text-gray-600">{"name" in user && user.name}</p>
                        </div>
                        <div className="dark:text-black space-y-4 flex flex-col gap-[1em]">
                            <input className=" p-[1em] rounded-lg border-white outline-none"
             type="text" value={postContent} onChange={(e) => setPostContent(e.target.value)} 
             placeholder="Tell something about Post." />

                            <div className="rounded-full bg-gray-200 flex justify-center items-center mx-[15%] h-[70%] w-[70%]">
                                {videourl ?<video src={videourl} controls></video>
                                :<><label htmlFor="post" className="cursor-pointer p-[2em]"><RiImageAddLine className="h-[2em] w-[2em] sm:h-[3em] sm:w-[3em]" /></label>
                                <input type="file" name="post" id="post" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} placeholder="Upload Photo" hidden />
                                </>}
                                </div>
                                {loading && <Loaderpost color="bg-white" text="bg-gray-700"/>}
                            <div  className="flex justify-center items-center">
                                <motion.button disabled={loading} className={`p-3  bg-blue-500 border border-black rounded-full w-[8em] sm:w-[10em] md:w-[12em] hover:bg-blue-700 font-semibold`} onClick={() => handlePost()}>Post</motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


