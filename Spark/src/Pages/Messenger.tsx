import { useEffect, useState } from "react"
import NavBar from "../Components/NavBar/NavBar"
import axios from "axios";
import LeftChat from "../Components/Messenger/LeftChat";
import RightChat from "../Components/Messenger/RightChat";
import { UseParent } from "../Context/ParentProvider";
import ConnectSocket, { socket } from "../Services/ConnectSocket";

export interface user_type{
   name:string,avatar:string,Uid:string,isActive:boolean,lastSeen:string
}

interface check{
   data:{
       accessToken:string,
   }
}

export default function Messenger(){
   const [user,setUser]=useState<(user_type & {count:number})>({Uid:"",name:"",avatar:"",isActive:false,lastSeen:"",count:0});
   const [users,setUsers]=useState<(user_type & {count:number})[]>([]);
   const {token,dispatch,user:spark_user}=UseParent();
   
   useEffect(()=>{
      async function check():Promise<void> {
         if(!token){
         const data:check|undefined=await axios.get("https://spark-9j9e.onrender.com/api/user/check",{withCredentials:true});
          dispatch({type:"add",payload:data && data.data && data.data.accessToken ? data.data.accessToken:""});   
         }
         }
      check();
  },[]);


   useEffect(()=>{
      async  function getFriends(){ 
      const res=await axios.get("https://spark-9j9e.onrender.com/api/friend/getAllFriend",{withCredentials:true})
      setUsers(res.data.user); 
   }
   getFriends();
   },[])


   useEffect(()=>{
      async function get(){
      if(token && "Uid" in spark_user){
      ConnectSocket(token);
      socket.emit("UserCameOnline","Uid" in spark_user?spark_user.Uid:"");
      }
      else{
      const data=await axios.get("https://spark-9j9e.onrender.com/api/user/",{withCredentials:true});
      dispatch({type:"addUser",payload:data.data?.user});
         }
         }
    get();
  },[token,spark_user])   




return(<>
    <div>
        <NavBar/>
    </div>
    <div className="grid bg-blue-50  mt-[3.7rem]  grid-rows-1 grid-cols-3 w-[100%] min-h-[500px] ">
   <LeftChat current={user} users={users} setUser={setUser} />
   <RightChat user={user}/>
   </div>
</>
    )
}

