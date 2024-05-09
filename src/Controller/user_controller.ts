import e, { Request, Response } from "express";
import { User} from "../db/Models/User_model";
//import UploadonCloudinary from "../services/uploadCloudinary";
import { custom_session } from "../Types/Interfaces";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToSupabaseBucket } from "../services/UploadSupabase";
import { user_type } from "../services/verifyJWT";
import getCurrentDateTimeAsString from "../services/getTime";
import { FriendRequest } from "../db/Models/FriendRequest_model";
import { emitter } from "../services/ConnectSocket";
import { UnseenPost } from "../db/Models/Unread_post";
import { Post, post } from "../db/Models/Post_model";
import mongoose from "mongoose";


interface obj{
    Uid:string,
    name:string,
    email:string,
    avatar:string,
    friendsList:object[],
}

interface obj2{
    sender: {
     Uid: string,
 name: string,
 avatar: string,
    },
 post:{
 comment:string[],
 photo:string,
 like:any[],
 text:string,
 posted:string,
 type:"photo"|"video",
 _id:string
 }
 }

 interface obj1{  
      Uid: string,
      name: string,
      avatar: string,
      comment:string[],
      photo:string,
      like:number,
      text:string,
      posted:string,
      post_id:string,
      type:"photo"|"video",
      }


export async function handleSignup(req: Request, res: Response) {


    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No avatar provided" });
        }

       

        const result = await uploadFileToSupabaseBucket(req.file.path);
        
       
        if (result) {
            const user = await User.create({
                Uid:uuidv4(),
                name,
                email,
                password,
                avatar:process.env.supabase_bucket+result.path,
                lastSeen: new Date().toISOString(),
            });

            const createdUser = await User.findById(user._id).select("-password -refreshToken");
            return res.status(201).json({ message: "Inserted successfully"});
        }
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function handleLogin(req: Request, res: Response) {
    try {
        const {email,password,checked}=req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "NO SUCH USER" });
        }

        const isCorrect = user.isPasswordCorrect ?password : false;
        if (!isCorrect) {
            return res.status(401).json({ message: "Wrong password" });
        }

        if (isCorrect) {
            const accessToken = user.generateAccessToken ? user.generateAccessToken() : "";
            const refreshToken = user.generateSecretToken ? user.generateSecretToken() : "";

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            const loggedinUser = await User.findById(user._id).select("-refreshToken -password");

            (req.session as custom_session).user_access = accessToken;
                console.log("line 120 ")
                console.log(accessToken)
            
            if (accessToken && refreshToken) {
                res.cookie("accessToken", accessToken);
                res.cookie("refreshToken", refreshToken);
            }
            res.redirect('https://spark-9j9e.onrender.com');
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function RefreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshtoken;

    try {
        if (!refreshToken) {
            return res.status(400).json({ message: "No Refresh Token provided" });
        }

        const decodedToken = jwt.verify(refreshToken, process.env.RefreshTokenSecret!) as { _id: string };
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(400).json({ message: "Incorrect Refresh Token" });
        }

        const accessToken = user.generateAccessToken ? user.generateAccessToken() : "";
        const newRefreshToken = user.generateSecretToken ? user.generateSecretToken() : "";

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshtoken", newRefreshToken)
            .json({ accessToken, message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function handleCheck(req: Request, res: Response) {
    if (req.cookies.accessToken) {
        return res.status(200).json({ accessToken: req.cookies.accessToken });
    }
  

   
    const session=req.session as custom_session;

    if (session && session.passport && "accessToken" in session.passport) {
        return res.status(200).json({ accessToken: session.passport.accessToken });
    } else {
        return res.status(401).json({ accessToken: "" });
    }
}

export async function getSingleUser(req: Request, res: Response) {
    if (req.user) {
        const { Uid, name, email, avatar } = req.user as user_type;

        const user = await User.findOne({ Uid: Uid });

        return res.status(200).json({
            "user": {
                Uid: Uid,
                name: name,
                email: email,
                avatar: avatar,
                followers: user?.friendsList ? user.friendsList.length : 0 
            }
        });
    } else {
        return res.status(401).json({ "user": {} });
    }
}


export async function handlePost(req: Request, res: Response) {
    try {
        const { Uid, text,video } = req.body;
        const senderUser = await User.findOne({ Uid });

        if(video && typeof(video)==="string"){

            if (!senderUser) {
                throw new Error("Sender user not found.");
            }

            const user = await Post.create({
                text: text,
                photo: video,
                posted: getCurrentDateTimeAsString(),
                type:"video"
            });

            await User.updateOne({ Uid }, { $push: { "Posts": user._id } });

            const friends = await User.aggregate([
                {
                    $match: { "Uid": Uid }
                },
                {
                    $lookup: {
                        "from": "users",
                        "localField": "friendsList.friend",
                        "foreignField": "_id",
                        "as": "result"
                    }
                },
                {
                    $unwind: "$result"
                },
                {
                    $project: {
                        "friendId": "$result._id",
                        "name": "$result.name",
                        "avatar": "$result.avatar",
                        "Uid": "$result.Uid"
                    }
                }
            ]);
            
            if(friends && friends.length>0){
                const bulkOps=friends.map((e)=>{
                      return {
                      updateOne:{
                      filter:{senderId:senderUser._id,receiverId:e.friendId},
                      update:{$push:{"posts":user._id}},
                      upsert:true,
                      }
                      }
                  })
             
                  await UnseenPost.bulkWrite(bulkOps);
              }


              return res.status(200).json({ message: "Post created successfully.",data:user });
        }

        else{
        if (!(req.file && req.file.path)) {
            throw new Error("No file uploaded.");
        }

        const result = await uploadFileToSupabaseBucket(req.file.path);
        if (!result || !result.path) {
            throw new Error("Failed to upload file to Supabase.");
        }

      
        if (!senderUser) {
            throw new Error("Sender user not found.");
        }

        const user = await Post.create({
            text: text,
            photo: process.env.supabase_bucket + result.path,
            posted: getCurrentDateTimeAsString(),
            type:"photo"
        });

        await User.updateOne({ Uid }, { $push: { "Posts": user._id } });

        const friends = await User.aggregate([
            {
                $match: { "Uid": Uid }
            },
            {
                $lookup: {
                    "from": "users",
                    "localField": "friendsList.friend",
                    "foreignField": "_id",
                    "as": "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    "friendId": "$result._id",
                    "name": "$result.name",
                    "avatar": "$result.avatar",
                    "Uid": "$result.Uid"
                }
            }
        ]);
        
            if(friends && friends.length>0){
              const bulkOps=friends.map((e)=>{

                    return {
                    updateOne:{
                    filter:{senderId:senderUser._id,receiverId:e.friendId},
                    update:{$push:{"posts":user._id}},
                    upsert:true,
                    }
                    }
                })

           
                await UnseenPost.bulkWrite(bulkOps);
            }
            return res.status(200).json({ message: "Post created successfully.",data:user });
    
    } 
}
    catch (error) {
        console.error("Error handling post:", error);
        return res.status(500).json({ message: "Internal server error." });
    }

}


export async function handleSearch(req: Request, res: Response) {
    const { name } = req.body;

    try {
        // Perform a case-insensitive search using a regex
        const users = await User.find({ name: { $regex: new RegExp(name, 'i') } }).select("name avatar Uid");

        if (users.length > 0) {
            return res.status(200).json({ users: users });
        } else {
            return res.status(200).json({users:[]});
        }
    } catch (error) {
        console.error("Error searching for users:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getUserProfile(req: Request, res: Response){

    interface obj{
        Uid:string,
        name:string,
        email:string,
        avatar:string,
        friendsList:object[],
    }
    const {Uid}=req.body;
   
    const user:obj|null= await User.findOne({ Uid: Uid });
   
    if(user && "name" in user && "email" in user && "avatar" in user){
    const {name, email, avatar }=user;

        return res.status(200).json({
            "user": {
                Uid: Uid,
                name: name,
                email: email,
                avatar: avatar,
                followers: user?.friendsList ? user.friendsList.length : 0 
            }
        });
    }
    else{
        return res.status(400).json({"message":"something wrong with profile"})
    }
}

export async function handlenewFollower(req: Request, res: Response){

    const {receiverid}:{receiverid:string}=req.body;
    let sendid;
   
    if(req  && req.user &&  "Uid" in req.user && typeof(req.user.Uid)==="string"){
        const senderid=(req.user.Uid)as string;
        sendid=senderid;
       const sender=await User.findOne({Uid:senderid});
       const receiver=await User.findOne({Uid:receiverid});

       if(receiver?.friendsList?.includes(sender?._id)){
        return res.status(200).json({"message":"already a follower"});
       }

       const result=await FriendRequest.create({
            senderid:sender?._id,
            receiverid:receiver?._id,
        });

        emitter.emit("newFriendRequest",{sender:sendid,receiver:receiverid});

        return res.status(200).json({"message":"done"});
    }
    else{
        return res.status(400).json({"message":"bad request"});
    }


}

export async function friendrequestAccept(req: Request, res: Response) {
    try {
        const user = req.user as user_type;

        const { Uid } = req.body;

        if (Uid) {
            const user_2 = await User.findOne({ Uid: Uid });
            if (user_2) {

                await FriendRequest.deleteMany({ senderid: user_2._id, receiverid: user?._id ?? "" });
                
                await User.updateOne({ Uid: Uid }, {
                    $push: { "friendsList": {friend:user?._id ?? "",isBlock:false} },
                });

                await User.updateOne({ _id: user?._id ?? "" }, {
                    $push: { "friendsList": {friend:user_2._id,isBlock:false}},
                });

                return res.status(200).json({ "message": "done" });
            } else {
                return res.status(404).json({ "message": "User not found" });
            }
            
        } else {
            return res.status(400).json({ "message": "No Uid provided" });
        }
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
}


export async function friendrequestReject(req: Request, res: Response) {
    try {
        const { Uid } = req.body;
        const user = req.user as user_type;

        if (Uid) {
            const user_2 = await User.findOne({ Uid: Uid });
            if (user_2) {
                await FriendRequest.deleteMany({ senderid: user_2._id, receiverid: user?._id ?? "" });
                return res.status(200).json({ "message": "Friend request rejected" });
            } else {
                return res.status(404).json({ "message": "User not found" });
            }
        } else {
            return res.status(400).json({ "message": "No Uid provided" });
        }
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
}


export async function getFriendRequests(req: Request, res: Response): Promise<void> {
    
    interface Result {
        name: string;
        Uid: string;
        avatar: string;
    }
    
    type AggregateResult = { _id: null; users: Result[][] };

    try {
        const user = req.user as user_type | undefined; // Assuming user_type is defined somewhere

        if (!user || !user._id) {
            throw new Error("User ID not found");
        }

        const data: AggregateResult[] = await FriendRequest.aggregate([
            {
                $match: {
                    receiverid: user._id
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderid",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $project: {
                    "result.name": 1,
                    "result.avatar": 1,
                    "result.Uid": 1,
                }
            },
            {
                $group: {
                    _id: null,
                    "users": { $push: "$result" }
                }
            }
        ]);

       let users:Result[]=[]

        if (data.length > 0 && data[0].users.length > 0 && data[0].users[0].length > 0) {
           data[0].users.map((e,i)=>{
           
            users.push({
                Uid: e[0].Uid,
                name: e[0].name,
                avatar: e[0].avatar
            });
           }) 
        }
        res.status(200).json({ users:users });
    } catch (error) {
        console.error("Error while fetching friend requests:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Sending 500 status in case of error
    }
}

export async function EligibletoFollow(req: Request, res: Response): Promise<void> {
    try {
        let result: "follow" | "pending" | "following" = "follow"; // Default value

        const { Uid }:{Uid:string} = req.body;

        const user = req.user as user_type; // Client

        if (Uid) {
            const user_2 = await User.findOne({ Uid: Uid });

            if (user_2 && user_2._id && user) {
                const friendRequest = await FriendRequest.findOne({ senderid: user._id, receiverid: user_2._id });

                if (friendRequest) {
                    result = "pending";
                } else {
                    const isFollowing = user_2.friendsList?.some(friend => friend.friend.equals(user._id) );
                    
                    if (isFollowing) {
                        result = "following";
                    }
                }
            }
        }

        res.status(200).json({ "state": result });
    } catch (error) {
        console.error("Error determining eligibility to follow:", error);
        res.status(500).json({ "state": "Internal Server Error" });
    }
}


export async function CheckOfflinePosts(req: Request, res: Response) {
    try {
        const user = req.user as user_type;

        // Retrieve unseen posts
        const unseenPosts = await UnseenPost.aggregate([
            { $match: { receiverId: user._id } },
            { $unwind: "$posts" },
            { $lookup: { from: "users", localField: "senderId", foreignField: "_id", as: "sender" } },
            { $lookup: { from: "posts", localField: "posts", foreignField: "_id", as: "post" } },
            { $sort: { "post.posted": -1 } },
            { $project: { sender: { $arrayElemAt: ["$sender", 0] }, post: { $arrayElemAt: ["$post", 0] } } },
            { $limit: 3 }
        ]);

        // Retrieve user's own posts
        const userPosts = await User.aggregate([
            { $match: { _id: user._id } },
            { $unwind: "$Posts" },
            { $lookup: { from: "posts", localField: "Posts", foreignField: "_id", as: "result" } },
            { $sort: { "result.posted": -1 } },
            { $project: { post: { $arrayElemAt: ["$result", 0] } } },
            { $limit: 3 }
        ]);

        const ans: obj1[] = [];

        // Map unseen posts
        unseenPosts.forEach(e => {
            ans.push({
                post_id: e.post._id,
                Uid: e.sender.Uid,
                name: e.sender.name,
                comment: e.post.comment,
                avatar: e.sender.avatar,
                like: e.post.like.length,
                text: e.post.text,
                posted: e.post.posted,
                photo: e.post.photo,
                type: e.post.type
            });
        });

        // Map user's own posts
        userPosts.forEach(e => {
            ans.push({
                post_id: e.post._id,
                Uid: user.Uid,
                name: user.name,
                comment: e.post.comment,
                avatar: user.avatar,
                like: e.post.like.length,
                text: e.post.text,
                posted: e.post.posted,
                photo: e.post.photo,
                type: e.post.type
            });
        });

        return res.status(200).json({ "state": ans.length === 3, posts: ans });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}


    export async function getNewOfflinePosts(req:Request,res:Response){


        const user=(req.user) as user_type
        const {time}:{time:string}=req.body
       
        const newposts:obj2[]=await UnseenPost.aggregate([
        {
          $match: {
            receiverId: user._id
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "result"
          }
        },
        {
          $unwind: "$posts"
        },
        {
          $lookup: {
            from: "posts",
            localField: "posts",
            foreignField: "_id",
            as: "result2"
          }
        },
        {
          $project: {
            "sender": { $arrayElemAt: ["$result", 0] },
            "post": { $arrayElemAt: ["$result2", 0] }
          }
        },
        {
          $match: {
            "post.posted": { $lt: new Date(time) }
          }
        },
        {
            $sort:{"post.posted":-1}
        },
        {
            $limit:3,
        }
      ]);

      interface userpost_type{
       
            _id: string
            like:string[],
            text: string,
            photo: string,
            posted:string,
            type: "photo"|"video",
            comment: string[],
      }

      const userPosts:{_id:string,post:userpost_type}[] = await User.aggregate<{_id:string,post:userpost_type}>([
        { $match: { _id: user._id } },
        { $unwind: "$Posts" },
        { $lookup: { from: "posts", localField: "Posts", foreignField: "_id", as: "result" } },
        { $project: { post: { $arrayElemAt: ["$result", 0] } } },
        {
            $match: {
              "post.posted": { $lt: new Date(time) }
            }
          },
          {
            $sort:{"post.posted":-1}
          },
        
        { $limit: 3 }
    ]);
 

      const result:obj1[]=[]

    userPosts.map((e)=>{
        result.push({post_id:e.post._id,Uid:user.Uid,name:user.name,comment:e.post.comment,avatar:user.avatar,
            like:e.post.like.length,text:e.post.text,posted:e.post.posted,photo:e.post.photo,type:e.post.type
        })
    })

       newposts.map((e)=>{

        result.push({post_id:e.post._id,Uid:e.sender.Uid,name:e.sender.name,comment:e.post.comment,
            avatar:e.sender.avatar,like:e.post.like.length,text:e.post.text,posted:e.post.posted,
            photo:e.post.photo,type:e.post.type});
      
    }  )
        if(result.length<3){
            return res.status(200).json({state:false,"user":result})
        }
        return res.status(200).json({state:true,"user":result});
    }



