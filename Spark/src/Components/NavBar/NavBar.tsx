import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { UseParent } from "../../Context/ParentProvider";
import { BiBell, BiSearchAlt, BiSolidBell } from "react-icons/bi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { RiSpaceShipFill } from "react-icons/ri";
import { FaFacebookMessenger } from "react-icons/fa";
import { user_data } from "../../Context/ParentProvider";
import axios from "axios";
import User from "../Common/User";
import { friend } from "../../Pages/DashBoard";
import Friend from "./Friend";

interface users{
    name:string,
    Uid:string,
    avatar:string,
}
export default function NavBar({friends,setFriends}:{friends?:friend[],setFriends?:Dispatch<SetStateAction<friend[]>>}) {
    const { token,isDark,dispatch } = UseParent();
    const [initialRender, setInitialRender] = useState<boolean>(false);
    const {user}:{user:user_data|object}=UseParent();   
    const [search_user,setSearchUser]=useState<string>("");
    const [users,setUsers]=useState<users[]>([]);
    const [notificaton,showNotification]=useState<boolean>(false);
    const nav=useNavigate();

    useEffect(() => {
        let debounceTimer:NodeJS.Timeout;
    
        async function sendRequest() {
            try {
                const response = await axios.post("https://spark-9j9e.onrender.com/api/user/search", {"name":search_user },{withCredentials:true});
                console.log(response.data);
                if(response.data.users.length>0){
                setUsers(response.data.users);
                }
                else{
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        if (search_user.length > 0) {
            debounceTimer = setTimeout(sendRequest, 1000);
        }
    
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [search_user]);
    

    useEffect(() => {
        setInitialRender(true);
    }, []);

    useEffect(()=>{
        if(initialRender===true){
        setInitialRender(false);
        }
    },[isDark])

    return (
        <>
            <motion.div 
                className={` grid grid-rows-1 fixed top-0 z-[10] w-[100vw]  ${token?"grid-cols-3":"grid-cols-4"} h-[4rem]`} 
                style={{ 
                    borderBottom: isDark ? "1px solid #8a8a8a" : "1px solid #FFFFFF",
                    backgroundColor:"white",
                    position:"fixed",
                }}
                animate={!initialRender &&  isDark ? { backgroundColor:"#242526",color: "#DDDFE3"}:{ backgroundColor:"#FFFFFF",color: "#000000" }  }
                transition={{  duration: 1 }}
            >   
                <div className={`md:ml-[1em] flex items-center justify-center gap-[1em] row-start-1 row-end-2 col-start-1 ${token ?"col-end-2":"col-end-2"}:`}>
                <div className="relative flex justify-center items-center rounded-full bg-black dark:bg-white">
    <motion.div className="p-[0.3em]" whileHover={{ x: ["-10%", "10%", "-10%", "10%", "0%"] }} transition={{ duration: 0.3, ease: "easeInOut" }}>
        <NavLink to='/'>
            <img src="/images/spark_1.png" className='ml-[0.5em] sm:ml-[0.3em] w-[2.5em] md:w-[3em] h-1em' alt="Logo" />
        </NavLink>
    </motion.div>
</div>

                {token &&  <div className=" border-2 border-black  rounded-full flex items-center ">
               <BiSearchAlt className='text-16px md:text-[20px] mx-1 ' />
               <input
                     type='text'
                  className='outline-none text-[15px] p-[0.5em] bg-inherit w-[80%]  font-medium dark:placeholder:text-[#b1b2b5] dark:text-[#cecfd2]  '
                    placeholder='Search user...'
                    value={search_user}
                     onChange={(e) => setSearchUser(e.target.value)}
                    />
                </div>}
                </div>
                
                {/* use token */}
               { !token?(<div className={`gap-[0.5em] sm:gap-[1em] row-start-1 row-end-2 flex justify-center items-center col-start-2  ${token ?"col-end-3":"col-end-4"} `}>

                        <NavLink
                            to='/home'
                            className={` relative bg-inherit text-[#c96c88] py-2 md:py-2.5 my-1 mx-1  flex justify-center hover:text-[#c24269] hover:bg-[#EBEDF0] rounded-[10px] text-[23px]  after:bg-[#c24269]     dark:bg-inherit dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
                            role='button'>
                            <AiFillHome className="w-[1.3em] h-[1.3em] sm:w-[2em] sm:h-[2em]" />
                        </NavLink>
                        <NavLink
                            to='/login'
                            className={`relative bg-inherit text-[#26A69A] py-2 md:py-2.5 my-1 mx-1  flex justify-center hover:text-[#00897B] hover:bg-[#EBEDF0] rounded-[10px] text-[23px]  after:bg-[#26A69A]     dark:bg-inherit dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
                            role='button'>
                            <RiSpaceShipFill className="w-[1.3em] h-[1.3em] sm:w-[2em] sm:h-[2em]" />
                        </NavLink>
                        <NavLink
                            to='/register'
                            className={`relative bg-inherit text-[#607D8B] py-2 md:py-2.5 my-1 mx-1  flex justify-center hover:text-[#455A64] hover:bg-[#EBEDF0] rounded-[10px] text-[23px]       dark:bg-inherit dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
                            role='button'>
                            <RiSpaceShipFill className="w-[1.3em] h-[1.3em] sm:w-[2em] sm:h-[2em] transform rotate-180"/>
                        </NavLink>
                </div>)
                :<div className={`row-start-1 row-end-2 w-[100%]  gap-[0.5em] md:gap-[1em] col-start-2 ${token?"col-end-3":"col-end-4"} flex justify-center items-center`}>
                 <div onClick={()=>nav("/")}  className="align-center flex justify-center items-center w-[4em] h-[4em]  hover:bg-[#EBEDF0] dark:hover:bg-[#3A3B3C] ">
                  <AiFillHome className="md:w-[1.2em] md:h-[1.2em] rounded-[10px] text-[25px] ]  dark:bg-inherit  dark:text-[#B8BBBF]  dark:hover:text-[#d2d5d7] "/>
                  </div>
                
                <div onClick={()=>nav("/messenger")} className="align-center  flex justify-center items-center w-[4em] h-[4em]  hover:bg-[#EBEDF0] dark:hover:bg-[#3A3B3C]">
                  <FaFacebookMessenger className="md:w-[1.2em] md:h-[1.2em] rounded-[10px] text-[25px] ]  dark:bg-inherit  dark:text-[#B8BBBF]  dark:hover:text-[#d2d5d7] " />
                </div>
                </div>
                }

         <div className={`row-start-1 flex justify-around items-center gap-[2px] sm:gap-[1em] row-end-2
          ${ token?"col-start-3 col-end-4":"col-start-4 col-end-5"}`}>
            
               <motion.div onClick={()=>dispatch({type:"toggle"})} 
               className="md:ml-[1em] hover:cursor-pointer dark:bg-Dark border-black dark:border-white border-2
                bg-white rounded-full w-[2.5em] h-[1.5em] relative">

    <motion.div className="bg-black dark:bg-white rounded-full h-full w-[25%] absolute"
        animate={isDark ? {left: '75%', backgroundColor: "#FFFFFF"} : {left: '0%', backgroundColor: "#000000"}}
        transition={{duration: 1}}>
    </motion.div>
</motion.div>

{/* {token.length>0 ?  <div className="flex  flex-col mr-[3em] sm:mr-[0] sm:flex-row gap-[0.2em] sm:gap-[1em] md:gap-[2em]">
   {!isDark?<BiSolidBell onClick={()=>showNotification((s)=>!s)} className="hover:cursor-pointer h-[1.5em] w-[1.5em] sm:h-[2.2em] sm:w-[2.2em] sm:mr-[0.2em] md:h-[2.5em] md:w-[2.5em]"></BiSolidBell>
       : <BiBell onClick={()=>showNotification((s)=>!s)} className="hover:cursor-pointer h-[1.9em] w-[1.9em] sm:h-[2.2em]  sm:mr-[0.2em] sm:w-[2.2em] md:h-[2.5em] md:w-[2.5em]"></BiBell>}
     <img src={user && "avatar" in user ?user.avatar:"/images/bg.png"} className=" w-[1.5em] h-[1.6em] sm:w-[2.3em] sm:h-[2.3em] md:w-[3em] md:h-[3em] rounded-full"></img>
    </div>:null} */}


    {token.length>0 ?  <div className=" flex justify-around sm:justify-normal  sm:mr-[0] flex-row gap-[0.2em] sm:gap-[1em] md:gap-[2em]">
    <img src={user && "avatar" in user ?user.avatar:"/images/bg.png"}
     className=" w-[2em] h-[2em] sm:w-[2.3em] sm:h-[2.3em] md:w-[3em] md:h-[3em] rounded-full"></img>
  
   {!isDark?<BiSolidBell onClick={()=>showNotification((s)=>!s)} className="hover:cursor-pointer h-[1.5em] w-[1.5em] sm:h-[2.2em] sm:w-[2.2em] sm:mr-[0.2em] md:h-[2.5em] md:w-[2.5em]"></BiSolidBell>
       : <BiBell onClick={()=>showNotification((s)=>!s)} className="hover:cursor-pointer h-[1.9em] w-[1.9em] sm:h-[2.2em]  sm:mr-[0.2em] sm:w-[2.2em] md:h-[2.5em] md:w-[2.5em]"></BiBell>}
     
    </div>:null}



    </div>

{ search_user.length>0 &&   (users.length>0 ?
<div className="fixed z-[100] top-[3.7em] md:left-[4em]  lg:left-[6em] xl:left-[10em]">
  {users.map((u,i)=>{
    return <User key={i} name={u.name} avatar={u.avatar} Uid={u.Uid} />
  })}
</div>:<h2 className="fixed z-[100] top-[4em] md:left-[4em]  lg:left-[6em] xl:left-[10em]">No such Users.</h2>)
}



{ token.length>0 ? friends && friends.length>0 ?  <div className=" fixed left-[95%] top-[0] sm:left-[96%] font-bold  z-[200] w-[1em] h-[1em]  text-black">
            {friends.length}</div>:<div className="fixed left-[95%] sm:left-[96%] font-bold  z-[200] w-[1em] h-[1em] dark:text-white   text-black">{0}
        </div>:null
    }

{
    notificaton && <RightModal setFriends={setFriends} friends={friends}/>
}
</motion.div>
    </>
    );
}


function RightModal({friends,setFriends}:{friends:friend[]|undefined,setFriends:Dispatch<SetStateAction<friend[]>>|undefined}){
    return (
        <>
        {friends && friends?.length>0 ?<div className="w-[100%] left-[10%]  fixed sm:left-[50%]  md:left-[55%]  lg:left-[55%] xl:left-[60%] top-[4em] z-[100]">
        {friends.map((e,i)=>{
            return <Friend key={i} setFriends={setFriends}  Uid={e.Uid} name={e.name} image={e.avatar}/>
        })}
        </div>:<div className="w-[100%] left-[10%]  fixed sm:left-[50%]  md:left-[60%]  lg:left-[60%] xl:left-[70%] top-[4em] z-[100]">
            <p className="text-center">No Notifications to Show!</p>
        </div>}
        </>
    )
}

