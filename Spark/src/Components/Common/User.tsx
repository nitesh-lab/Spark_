import { useNavigate } from "react-router-dom"

export default function User({name,avatar,Uid}:{name:string,avatar:string,Uid:string}){

    const nav=useNavigate();
    
    function handleClick(){

    nav(`/profile/${Uid}`)       
    }

    return (

        <div onClick={()=>handleClick()} className=" hover:cursor-pointer rounded-lg flex shadow-post  my-[0] w-[98%] mx-[1%] sm:mt-[0.4em]  sm:rounded-lg sm:w-[80%] sm:mx-[10%]  gap-[0.2em] md:gap-[1em]  bg-white bg-clip-border-black text-black dark:bg-Dark dark:text-white shadow-md">
        <div className=" rounded-full my-[1em] mx-4 mt-4   bg-white   shadow-lg">
          <img className=" h-[2em]   w-[2em] md:h-[3em] md:w-[3em] rounded-full" src={avatar} alt="profile-picture" />
        </div>
        <div className="p-[1em] mr-[0.2em] text-center">
          <p className="mb-2 mr-[0.1em] sm:mr-[1em] block font-sans text-[0.7rem] md:text-[1rem]  font-semibold leading-snug tracking-normal  antialiased">
          {name}
          </p>
        </div>
      </div>
    )
}
