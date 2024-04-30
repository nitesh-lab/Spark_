import { log } from "../Pages/Login";
import { signup } from "../Pages/Register";
import axios from "axios";

export async function Server_Register(obj:signup) {
 
       const { name, email, password,avatar } = obj;
  
       try {
         const formData = new FormData();
         formData.append('name', name);
         formData.append('email', email);
         formData.append('password', password);
         formData.append('avatar', avatar?avatar[0]:"");  // Use the first item in the FileList

        const data:string|null=await axios.post("http://localhost:3000/user/signup",formData);
        return data;    
    }
       catch(e){
        console.log(e);
       }
    }

    export async function ServerLogin(obj:log):Promise<string|undefined>{
      try{
      const data=await axios.post("http://localhost:3000/user/login",obj,{withCredentials:true});
       return (data.data.accessToken) as string;
      }
      catch(e){
         console.log(e);
      }
   }

   export async function ServerLogin_Google() {
      try{
         window.location.href = "http://localhost:3000/user/google";
      }
         catch(e){
            console.log(e);
         }
   }