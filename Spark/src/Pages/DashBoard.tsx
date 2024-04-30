import {useEffect, useState} from "react";

import Center from "../Components/DashBoard/Center";
import { UseParent, user_data } from "../Context/ParentProvider";
import NavBar from "../Components/NavBar/NavBar";
import axios from "axios";
import ConnectSocket, { socket } from "../Services/ConnectSocket";
import VideoModal from "../Components/DashBoard/VideoModal";


interface obj{
    data:{
        user:user_data
    }
}
export interface friend{
    name:string,
    avatar:string,
    Uid:string,
}

function Dashboard(){

    const {token,user,dispatch}=UseParent();
    const [friendRequest,setFriendRequest]=useState<friend[]>([]);
    const [isVideoopen,setisVideoopen]=useState<boolean>(false);
    const [videourl,setVideourl]=useState<string>("");

    useEffect(()=>{
        if(token){
        ConnectSocket(token);
        }
        
        return ()=>{
            socket.disconnect();
        }
    },[token])

    useEffect(()=>{

        socket.on("newFriendRequest",(m:friend)=>{
            
            setFriendRequest((s)=>{
                if(s.includes(m)){
                    return s;
                }
            else{
             return [...s,{...m}]
            }
            });
        });

        socket.emit("UserCameOnline","Uid" in user?user.Uid:"");
        
        return ()=>{
            socket.off("newFriendRequest");
        }
    },[token])

    useEffect(()=>{

        async function getUser(){
            if(!("Uid" in user)){
                const data:obj=await axios.get("http://localhost:3000/user/",{withCredentials:true});
                dispatch({type:"addUser",payload:data.data?.user});
               
               const result=await axios.get("http://localhost:3000/user/getFriendRequests",{withCredentials:true});
               
               const d:friend[]=(result.data.users)as friend[]

               setFriendRequest((s)=>[...s,...d])
            }
            else{
                return;
            }
          }
        getUser();
    },[])

    return (
        <>
        <div>
        <NavBar friends={friendRequest} setFriends={setFriendRequest}/>
        
        <div className='bg-blue-100 dark:bg-black overflow-x-hidden min-h-screen mt-[1em] pt-16 md:pt-[85px]  '>
            <div className='w-screen grid grid-cols-11 md:gap-x-12 px-3 sm:px-7 md:px-10 relative '>
                <div className='hidden md:grid col-span-11 md:col-span-3 relative order-1 '>
               
                </div>
                {isVideoopen && <VideoModal setVideourl={setVideourl} setisVideoopen={setisVideoopen}/>}
                <div className='col-span-11 md:col-span-5 shrink-0 order-3 md:order-2 '>
                    <Center
                    setisVideoopen={setisVideoopen} videourl={videourl} setVideourl={setVideourl}
                    />
                </div>
                
                <div className='col-span-11 md:col-span-3 relative order-2 md:order-3 '>
                </div>
            </div>
        </div>
        </div>
        </>

    );

}

export default Dashboard;