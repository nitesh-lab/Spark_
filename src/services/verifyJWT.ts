import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/Models/User_model";

export interface user_type{
    Uid:string,
    _id: string,
    email: string,
    name:string,
    avatar: string,
}

export  default async function verifyJWT(req:Request,res:Response,next:NextFunction){

        let token;

        if(!req.headers.authorization && !req.cookies.accessToken ){
           return res.status(401).json({"message":"Authentication Token Required","check":false});
        }
    
        if(req.headers.authorization){
     
        token=req.headers?.authorization?.replace("Bearer ",""); 
    
    if(token.length<10){
       return res.status(401).json({"message":"unauthorized","check":false});
    }
    
}
    if(req.cookies.accessToken){
        token=req.cookies.accessToken;
    }
  


    const decodedtoken=(jwt.verify(token ? token:"",process.env.ACCESS_TOKEN_SECRET!))as user_type;

    if("_id" in decodedtoken){
    const user=await User.findById(decodedtoken._id).select("-password -refreshToken")

        if(!user){
            return res.status(401).json({"message":"No such user","check":false})
        }

    req.user=user;
    }
    next();
}