import { user_type } from "../../Pages/Messenger"
import Friend from "./Friend"

export default function LeftChat({current,setUser,users}:{ current:(user_type&{count:number}),users:(user_type&{count:number})[],setUser:React.Dispatch<React.SetStateAction<(user_type&{count:number})>>}){
    return <>
    <div  className="col-start-1 flex flex-col overflow-y-scroll  gap-[0.2em] sm:gap-[0.5em] mt-[0.5em] md:mt-[1em] col-end-2 mr-[1em] ">   
      {users.map((e,ind)=>{
         return <Friend  key={ind} current={current} setUser={setUser} user={e}/>
      })}
</div>    
    </>
}
