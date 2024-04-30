import { ReactNode } from "react";
import { UseParent } from "../Context/ParentProvider"
import { Navigate } from "react-router-dom";


export default function ProtectedLayout({children}:{children:ReactNode}){

       const {token}=UseParent();
       
       if(!token){
        return <Navigate to="/home"/>
       }

    return(<>
    {children}
    </>
    )
}