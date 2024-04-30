import {  Dispatch, ReactNode, createContext, useContext, useReducer } from "react";


export interface user_data{
    name:string,
    avatar:string,
    Uid:string,
    followers?:string,
}

interface ReducerState{
    isDark:boolean,
    token:string,
    user:user_data|object,
}

console.log("came parent");

interface ReducerAction{
    type:string,
    payload?:user_data|string|boolean,
}

type Parent=ReducerState & {
   dispatch:Dispatch<ReducerAction>
}

const ParentContext=createContext<Parent>({
    isDark: false,
    token: "",
    user:{},
    dispatch:()=>{}
});

    function Reducer(state:ReducerState,action:ReducerAction):ReducerState{

        switch(action.type){
            case "toggle":
                return {...state,isDark:!state.isDark}
            case "add":
                return {...state,token:typeof(action.payload)==='string' ? action.payload:""}
            case "addUser":
                return {...state,user:typeof(action.payload)==="object" && "Uid" in action.payload?action.payload:{}}
            default:
                return state
        }
    }
export default function ParentProvider({children}:{children:ReactNode}){

    const [state,dispatch]=useReducer(Reducer,{ isDark:false,token:"",user:{}});

        const {isDark,token,user}=state;
    return (
        <ParentContext.Provider value={{isDark,token,dispatch,user}}>
            {children}
        </ParentContext.Provider>
    )
}


export function UseParent(){
    return useContext(ParentContext);
}

