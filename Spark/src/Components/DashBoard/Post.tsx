import { AiFillHeart, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { post } from "./Center";
import axios from "axios";
import  { useEffect, useState } from "react";
import CommentSection from "../Common/CommentSection";
import { socket } from "../../Services/ConnectSocket";

export default function Post({ post }: { post: post}) {

    const [eligibiletoLike,setLike]=useState<boolean>(true);
    const [inp,setInp]=useState<string>("");
    const [showComment,SetshowComment]=useState<boolean>(false);
    const [showFullPhoto,setFullPhoto]=useState<boolean>(false);

    useEffect(()=>{
        async function Check() {
            if("post_id" in post){
        const data=await axios.post("https://spark-9j9e.onrender.com/api/post/Checklike",{post_id:post.post_id},{withCredentials:true})
        setLike(data.data.state)
            }
            else{
                return;
            }
        }
        Check()
    },[post])

   async function handleLike(){
    console.log("coming")

    const eligible=eligibiletoLike
    const data=await axios.post("https://spark-9j9e.onrender.com/api/post/like",{"Uid":post.Uid,"post_id":post.post_id},{withCredentials:true});
    
    if(eligible){
        socket.emit("newLike",{_id:post.post_id});
    }
    setLike(data.data.state);
    }

    async function handleComment() {
        if(inp){
            console.log(inp);
           await axios.post("https://spark-9j9e.onrender.com/api/post/Comment",{"post_id":post.post_id,"comment":inp},{withCredentials:true});
            setInp("");
            socket.emit("newComment",{_id:post.post_id})
        }
    }

    function getTimeDifference(imageUploadTime: string): string {
        const uploadDate = new Date(imageUploadTime);
        const currentDate = new Date();
    
        const timeDifference: number = currentDate.getTime() - uploadDate.getTime();
    
        const minutesDifference: number = Math.floor(timeDifference / (1000 * 60));
        const hoursDifference: number = Math.floor(timeDifference / (1000 * 60 * 60));
    
        if (minutesDifference < 60) {
          
            return `${minutesDifference} minutes ago`;
        } else if (hoursDifference < 24) {
            
            return `${hoursDifference} hours ago`;
        } else {
            
            const daysDifference: number = Math.floor(hoursDifference / 24);
            return `${daysDifference} days ago`;
        }
    }


return (
    "type" in post && post.type === "video" ? (

        <div className="grid my-[1em] shadow-post max-h-[450px] md:max-h-[550px] bg-white dark:bg-[#242526]
         dark:text-white sm:w-[70%] sm:mx-[15%] md:w-[60%] md-mx-[20%] w-[80%]  mx-[10%] rounded-[8%]  grid-rows-8 gap-[0.1em]">
            
                <div className="grid grid-rows-2 grid-cols-2 row-start-1 row-end-2">
                    <div className="row-start-1 row-end-3 col-start-1 col-end-2">
                        <img src={post.avatar} className="rounded-full w-[2em] h-[2em] mt-[1em] ml-[1em]" alt="nope" />
                    </div>
                    <div className="row-start-1 row-end-2 col-start-2 col-end-3">
                        <p className="mt-[0.5em] md:mt-[1em]">{post.name}</p>
                    </div>
                </div>

                <div className="row-start-2 row-end-3">
                    <div className="text-center flex justify-around items-center ">
                    <p className="mt-[1em] ml-[0.5em] sm:ml-[0.8em] md:ml-[1em]">{post.text}</p>
                    <p className="mt-[1em] ml-[0.5em] sm:ml-[0.8em] md:ml-[1em]">{getTimeDifference(post.posted)}</p>
                    </div>
                </div>

                <div className="flex justify-center hover:cursor-pointer row-start-3 row-end-6" >
                <video src={post.photo} controls className="h-[100%] w-[100%]"> </video>
                </div>

                <div className="row-start-6 row-end-7 flex justify-between">
                    <div className="ml-[1em] mt-[1em]">
                        <AiOutlineHeart className='text-[18px] text-[#65676b] inline-block mr-[0.4em] dark:text-[#afb0b1]' />
                        <span>
                            {post.like} likes
                        </span>
                    </div>
                    <div className="mr-[0.5em] mt-[1em] ">
                        {post.comment.length} comments
                    </div>
                </div>

                <div className="flex justify-around row-start-7 row-end-8">
                    <div>
                        <button onClick={() => handleLike()} className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] transition-50 cursor-pointer ' disabled={!eligibiletoLike}>
                            <AiFillHeart className={`text-xl translate-y-[1px] ${eligibiletoLike?"text-white":"text-red-500"}`} />
                            Like
                        </button>
                    </div>
                    <div>
                        <button onClick={() => SetshowComment(true)} className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer'>
                            <FiMessageSquare className='text-xl translate-y-[2px]' />
                            Comment
                        </button>
                    </div>
                </div>

                <div className="row-start-8 row-end-9">
                    <div className='flex my-[0.5em] gap-x-1.5 px-2 sm:px-3 md:px-4 py-1 items-center'>
                        <img src="/images/logo.png" alt='user_avatar' className='w-8 sm:w-9 h-8 sm:h-9 object-cover shrink-0 rounded-full' />
                        <form className='flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]' onSubmit={(e) => { e.preventDefault(); handleComment(); }}>
                            <input type='text' className='px-2 py-1 sm:py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8]' placeholder='Write a comment...' value={inp} onChange={(e) => setInp(e.target.value)} />
                            <button>
                                <AiOutlineSend className='shrink-0 text-xl transition-50 hover:scale-125 dark:text-[#b0b3b8]' />
                            </button>
                        </form>
                    </div>
                </div>

                {showComment && <CommentSection SetshowComment={SetshowComment} id={post.post_id} />}
           
        </div>
    ) 
    
    : 
        <div className="grid my-[1em] shadow-post max-h-[420px] md:max-h-[450px]  bg-white dark:bg-[#242526] dark:text-white sm:w-[70%]  sm:mx-[15%] md:w-[60%] md-mx-[20%]  w-[90%]  mx-[5%] rounded-[8%]  grid-rows-8 ">
       
                <div className="grid grid-rows-2 grid-cols-2 row-start-1  row-end-2">
                    <div className="row-start-1 row-end-3 col-start-1 col-end-2">
                        <img src={post.avatar} className="rounded-full w-[3em] h-[3em] mt-[1em] ml-[1em]" alt="nope" />
                    </div>
                    <div className="row-start-1 row-end-2 col-start-2 col-end-3">
                        <p className="mt-[0.5em] md:mt-[1em]">{post.name}</p>
                    </div>
                    
                </div>

                <div className="row-start-2 row-end-3 mt-[1em] ml-[1em]">
                <div className="text-center flex justify-around items-center ">
                    <p className="mt-[1em] ml-[0.5em] sm:ml-[0.8em] md:ml-[1em]">{post.text}</p>
                    <p className="mt-[1em] ml-[0.5em] sm:ml-[0.8em] md:ml-[1em]">{getTimeDifference(post.posted)}</p>
                    </div>
                </div>

                <div className="flex justify-center hover:cursor-pointer row-start-3 row-end-6" onClick={() => setFullPhoto(true)}>
                    <img src={post.photo} className="mx-[5%] p-[1em] w-[90%]" alt="" />
                </div>

                <div className="flex justify-around row-start-6 row-end-7">
                    <div className="ml-[0.2em]">
                        <AiOutlineHeart className='text-[18px] text-[#65676b] inline-block mr-[0.4em] dark:text-[#afb0b1]' />
                        <span>
                            {post.like} likes
                        </span>
                    </div>
                    <div className="me-[0.2em]">
                        {post.comment.length} comments
                    </div>
                </div>

                <div className="row-start-7 row-end-8 flex  justify-between">
                    <div>
                        <button onClick={() => handleLike()} className='ml-[1em] py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] transition-50 cursor-pointer ' disabled={!eligibiletoLike}>
                        <AiFillHeart className={`text-xl translate-y-[1px] ${eligibiletoLike?"text-white":"text-red-500"}`} />
                            Like
                        </button>
                    </div>
                    <div>
                        <button onClick={() => SetshowComment(true)} className='mr-[1em] py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer'>
                            <FiMessageSquare className='text-xl translate-y-[2px]' />
                            Comment
                        </button>
                    </div>
                </div>

                <div className="row-span-1">
                    <div className='flex my-[0.5em] gap-x-1.5 px-2 sm:px-3 md:px-4 py-1 items-center'>
                        <img src="/images/logo.png" alt='user_avatar' className='w-8 sm:w-9 h-8 sm:h-9 object-cover shrink-0 rounded-full' />
                        <form className='flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]' onSubmit={(e) => { e.preventDefault(); handleComment(); }}>
                            <input type='text' className='px-2 py-1 sm:py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8]' placeholder='Write a comment...' value={inp} onChange={(e) => setInp(e.target.value)} />
                            <button>
                                <AiOutlineSend className='shrink-0 text-xl transition-50 hover:scale-125 dark:text-[#b0b3b8]' />
                            </button>
                        </form>
                    </div>
                </div>

                {showFullPhoto && (
                    <div className="fixed z-50 inset-0 left-[5%] right-[5%] w-[90%] md:w-[50%] md:left-[25%] md:right-[25%] bg-Dark">
                        <div className="ml-[90%] mt-[5%]">
                            <button onClick={() => setFullPhoto(false)} className="text-[1rem] md:text-[2rem]">X</button>
                        </div>
                        <div className="mt-[25%] sm:mt-[10%] flex justify-center items-center">
                            <img src={post.photo} className="w-[100%] h-[200px] sm:h-[auto] mx-[5%]" alt="" />
                        </div>
                    </div>
                )}

                {showComment && <CommentSection SetshowComment={SetshowComment} id={post.post_id} />}
            
        </div>
    )

}