import axios from "axios";
import { user_type } from "../../Pages/Messenger";

export default function Friend({current,setUser,user}:{current:(user_type&{count:number}),setUser:React.Dispatch<React.SetStateAction<(user_type&{count:number})>>,user:(user_type&{count:number})}){

  async function handleClick() {
    if(current.name!==user.name){
    const res=await axios.post("https://spark-9j9e.onrender.com/api/friend/single",{Uid:user.Uid},{withCredentials:true});
    console.log(res.data)
    setUser(res.data.user)
    }
    else{
      setUser(user);
    }
  }
    return (
       <div onClick={()=>handleClick()} className="hover:cursor-pointer rounded-lg flex shadow-post 
        my-[0] w-[98%] mx-[1%] sm:mt-[0.4em]  
        sm:rounded-lg sm:w-[80%] sm:mx-[10%]  gap-[0.2em] md:gap-[1em]   bg-clip-border-black
         text-black dark:bg-Dark dark:text-white shadow-md">

   <div className=" w-[100%]  rounded-full p-[0.2em]  my-[1em]  mx-4 mt-4      shadow-lg">
     <img className="w-[100%]  md:h-[3em] md:w-[3em] rounded-full" src={user?.avatar} alt="profile-picture" />
   </div>

   <div className=" flex justify-center items-center p-[0.2em] md:p-[1em] text-center">
     <p className="mb-2 text-center block font-sans text-[0.6rem] md:text-[1rem]  font-semibold leading-snug tracking-normal  antialiased">
      {user?.name}
     </p>
     </div>

     <div className="flex justify-center items-center mr-[0.5em]">
     <p className=" w-[0.5em] rounded-full text-black dark:text-white">{user?.count}</p>
     </div>

   </div>
    )
 }