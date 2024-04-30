import { useEffect, useState } from "react";

export default function useDebounce(search_user:string){

const [send,setSend]=useState<boolean>(false);

useEffect(()=>{
    if(search_user.length>0){
    setTimeout(()=>{
        setSend(true);
    },1000);
}
},[search_user]);

    return send;
}