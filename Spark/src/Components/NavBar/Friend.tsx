import axios from "axios"
import { Dispatch, SetStateAction } from "react";
import { friend } from "../../Pages/DashBoard";


export default function Friend({Uid,name,image,setFriends}:{setFriends:Dispatch<SetStateAction<friend[]>>|undefined,Uid:string,name:string,image:string}){
    
   async function handleAccept(){
   
    if(setFriends){
    setFriends((s)=>{
        return s.filter((e)=>{
           return e.name!=name
        })
    })
}
        await axios.post("https://spark-9j9e.onrender.com/api/user/friendrequestAccept",{Uid:Uid},{withCredentials:true});
    }
   
    async function handleReject(){
       
        if(setFriends){
            setFriends((s)=>{
                return s.filter((e)=>{
                    e.name!=name
                })
            })
        }

        await axios.post("https://spark-9j9e.onrender.com/api/user/friendrequestReject",{Uid:Uid},{withCredentials:true});
    }
   
    return(
        <>
         <div className="lg:gap-[0.8em] gap-[0.4em] sm:gap-[1em] md:gap-[0.8em] w-[90%] sm:w-[50%] lg:w-[40%] xl:w-[30%] rounded-full flex my-[1em] mx-4 mt-4   bg-blue-200  shadow-lg">
      <div className="flex justify-center items-center">
      <img className=" h-[2em]   w-[2em] md:h-[3em] md:w-[3em] rounded-full" src={image} alt="profile-picture" />
      </div>
    <div className="flex justify-center items-center mr-[0.1em] sm:mr-[1em]">
      <p className="mb-2     block font-sans text-[0.8rem] md:text-[1rem]  leading-snug tracking-normal  antialiased">
     {name}
      </p>
    </div>
    <div className="flex justify-center items-center ml-[0.1em] ">
    <button className="bg-green-500 rounded-lg   p-[0.5em] sm:p-[0.8em] text-white" onClick={()=>handleAccept()} >Accept</button>
    </div>
    <div className="flex justify-center items-center">
    <button className="bg-red-500 rounded-lg p-[0.5em] sm:p-[0.8em] text-white" onClick={()=>handleReject()}>Reject</button>
    </div>
    </div>
        </>

    )
}