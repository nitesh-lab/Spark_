import { useParams } from "react-router-dom";
import { UseParent, user_data } from "../Context/ParentProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import ConnectSocket, { socket } from "../Services/ConnectSocket";
import PostFeed from "../Components/Common/PostsFeed";
import { FaUserFriends } from "react-icons/fa";

    export interface post{
            like?:string[],
            comment: {user:string,comment:string}[];
            text: string;
            photo?: string;
            posted: string; 
            type:"photo"|"video",
            post_id:string
    }

    type follow="follow"|"pending"|"following"
export default function Profile() {
    
    const [users,setUser]=useState<user_data>({name:"",avatar:"",Uid:""});
    const {data}=useParams();
    const {user}=UseParent();
    const [check,setCheck]=useState<follow>("follow");
    const [posts,setPosts]=useState<post[]>([]);
    const {token,dispatch}=UseParent();

    useEffect(()=>{
        async function Check() {
            if(token && token.length>0){
                console.log("phir connect k lie gaaye")
              ConnectSocket(token)
            }
            else{
                console.log("pahle token laaya")
       const data=await axios.get("https://spark-9j9e.onrender.com/api/user/check",{withCredentials:true});
    dispatch({type:"add",payload:data && data.data && data.data.accessToken ? data.data.accessToken:""});
            }
        }
        Check()
    },[token])

    useEffect(()=>{
       async function getUser() {
        if(data){
            const res=await axios.post("https://spark-9j9e.onrender.com/api/user/userProfile",{Uid:data},{withCredentials:true});
            const res2=await axios.post("https://spark-9j9e.onrender.com/api/user/checkEligible",{Uid:data},{withCredentials:true});
            setUser(res.data.user);
            setCheck(res2.data.state);    
        }
       }
       getUser();

    },[data])

    useEffect(()=>{

        async function getAllPosts(){
            if(data){
           const res= await axios.post("https://spark-9j9e.onrender.com/api/post/getAllPosts",{Uid:data},{withCredentials:true});
                setPosts(res.data.posts)
        }
       
    }
    getAllPosts()
    },[data])

    useEffect(()=>{

        socket.on("unfollow",(flag:boolean)=>{
            console.log("58 callbck")
            setUser((s)=>{
                if(flag){
                const stringValue = (s.followers)!; 
                let numberValue = parseInt(stringValue);
                numberValue -= 1; 
                return {...s,followers:numberValue.toString()}
                }
                else{
                    return s;
                }
            })
            setCheck("follow")
        })


        return ()=>{
            socket.off("unfollow")
            socket.disconnect()
        }
    },[])


    useEffect(()=>{
        if(user){
        socket.emit("UserCameOnline","Uid" in user?user.Uid:"");
        }
    },[user])


   async function handleFollow(){

        if(check==="follow"){    
       const res=await axios.post("https://spark-9j9e.onrender.com/api/user/newFollower",{receiverid:data},{withCredentials:true});
        console.log(res);
        setCheck("pending")
   }
    }

     function handleUnfollow() {
        console.log("coming")
        if(data){
            try{
            console.log("coming2")
        socket.emit("UNFOLLOW",{receiverid:data})
            }
            catch(e){
                console.log(e+"95")
            }
        }
    }

    return (
        <>
            <div className=" min-h-[13em] md:min-h-[15em] lg:min-h-[18em] xl:min-h-[20em] bg-gray-200 p-8">
             
                <div className="bg-white rounded-lg shadow-xl pb-8">
                    <div className="w-[80%] mx-[10%] h-[10em] md:h-[200px]">
                        <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className="w-full h-full rounded-tl-lg rounded-tr-lg" />
                    </div>
                    <div className="flex flex-col items-center -mt-20">
                        <img src={users.avatar} className="w-[8em] md:w-40 border-4 border-white rounded-full" />
                        <div className="flex items-center space-x-2 mt-2">
                            <p className="text-[1rem] font-bold lg:text-2xl">{users.name}</p>
                            <span className="bg-blue-500 rounded-full p-1" title="Verified">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        </div>
                       <p>{users.followers} Followers</p>
                    </div>
                   <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2">
                        <div className="flex items-center space-x-4 mt-2">
                            <button  onClick={()=>handleFollow()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                     <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                                <span>{check}</span>
                            </button>
                            { check!=="follow" &&   <button onClick={()=>handleUnfollow()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                                <FaUserFriends/>
                                <span>UnFollow</span>
                            </button>}
                        </div>
                    </div>
                </div>
       </div>
       <PostFeed uid={users.Uid} posts={posts}/>
       </>
    )}
       