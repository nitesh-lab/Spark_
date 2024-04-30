import { Request, Response } from "express";
import { Post } from "../db/Models/Post_model";
import { user_type } from "../services/verifyJWT";
import { UnseenPost } from "../db/Models/Unread_post";
import mongoose from "mongoose";
import uploadCloudinary from "../services/uploadCloudinary";
import { User } from "../db/Models/User_model";

export async function handleLike(req: Request, res: Response) {
    const user = req.user as user_type;
    const { post_id } = req.body;

    const existingLike = await Post.findOne({ _id: post_id, like: user._id });

    if (existingLike) {
        return res.status(200).json({ "state":false });
    } else {
      
        await Post.updateOne({ _id: post_id }, {
            $addToSet: { like: user._id }
        });

        return res.status(200).json({ "state":false});
    }
}

export async function Checklike(req: Request, res: Response) {
    const user = req.user as user_type;
    const { post_id } = req.body;

    const existingLike = await Post.findOne({ _id: post_id, like: user._id });

    if (existingLike) {
        return res.status(200).json({ "state":false });
    } else {
        return res.status(200).json({ "state":true});
    }
}



export async function handleComment(req: Request, res: Response) {
    const user = req.user as user_type;
    const { post_id, comment } = req.body;

    await Post.updateOne({ _id: post_id }, {
        $push: { comment: { user: user._id, comment: comment } }
    });



    res.status(200).json({"message":"done"})
}


export async function getAllComments(req: Request, res: Response) {
    const { post_id }: { post_id: string } = req.body;


    interface comments{
        _id:string,
        comment:string,
        user:{
            Uid:string,
            avatar:string,
            name:string,
        }
    }

    type comment=comments[]

    const comments_result:comment = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(post_id) // Convert post_id to ObjectId
            }
        },
        {
            $unwind: "$comment"
        },
        {
            $lookup: {
                from: "users",
                localField: "comment.user",
                foreignField: "_id",
                as: "result"
            }
        },
        {
            $project: {
                "comment": "$comment.comment",
                "user": { $arrayElemAt: ["$result", 0] }
            }
        }
    ]);

    let result:{
        Uid:string,
        avatar:string,
        name:string,
        comment:string
    }[]=[];

    comments_result.map((e)=>{
        result.push({Uid:e.user.Uid,avatar:e.user.avatar,name:e.user.name,comment:e.comment});
    })

    return res.status(200).json({ "user": result });
}

export async function postVideo(req:Request,res:Response){

    const {url,type}:{url:string,type:string}=req.body;

    if(url){
   const result=await uploadCloudinary(url);

   return res.status(200).json({"url":result});
  
}
    else{
        return res.status(400).json({"message":"No url provided"});

    }
}

export async function getAllPosts(req:Request,res:Response) {

    const {Uid}=req.body;

    interface post{
        _id:null,
        result:{
            _id:string,
            like?:string[],
            comment: {user:string,comment:string}[];
            text: string;
            photo?: string;
            posted: string; 
            type:"photo"|"video",
        }
    }
   const result:post[]=await User.aggregate<post>([
        {
            $match: {
                "Uid": Uid,
            },
        },
        {
            $unwind: "$Posts",
        },
        {
            $lookup: {
                from: "posts",
                localField: "Posts",
                foreignField: "_id",
                as: "result"
            },
        },
        {
            $project: {
                "result": { $arrayElemAt: ["$result", 0] },
            }
        }
    ]);

    let result_copy:{
        like?:string[],
        comment: {user:string,comment:string}[];
        text: string;
        photo?: string;
        posted: string; 
        type:"photo"|"video",
        post_id:string
    }[]=[];
    console.log("line 160")
  
    result.map((e)=>{
        result_copy.push({post_id:e.result._id,like:e.result.like||[],comment:e.result.comment,text:e.result.text,photo:e.result.photo,posted:e.result.posted,type:e.result.type})
    })
    
    return res.status(200).json({"posts":result_copy});

}