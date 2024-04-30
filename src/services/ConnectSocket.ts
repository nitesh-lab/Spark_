import {Server, Socket} from "socket.io";
import * as http from "http";
import jwt from "jsonwebtoken";
import { User } from "../db/Models/User_model";
import { UnreadMessage } from "../db/Models/UnreadMessage_model";
import {EventEmitter} from "events";
import { Message } from "../db/Models/Message_model";
import { user_type } from "./verifyJWT";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ObjectId } from "mongoose";

export const emitter=new EventEmitter();


export function ConnectSocket(server:http.Server){

    interface user{
        _id: string,
        email:string,
        name: string,
        avatar: string,
    }

    const users:Map<string,string>=new Map(); // maps user token with socket id
    const sockets:Map<string,Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>=new Map(); // maps users id with socket instance

    const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true,
    }
   })

   emitter.on("newFriendRequest",async({sender,receiver}:{sender:string,receiver:string})=>{

        //socket m jaise hi user aaye uska isactive true kr pahle.
       const user=await User.findOne({Uid:receiver});
        
       if(user &&  user.isActive && user.isActive===true){

        //await FriendRequest.deleteOne({_id:doc});

        //sender ki details nikalo
        const sender_user=await User.findOne({Uid:sender});
        
        io.emit("newFriendRequest",{name:sender_user?.name,avatar:sender_user?.avatar,Uid:sender_user?.Uid});
        return;
    }
    else{
        return;
    }
   });

   io.on("connection",(socket)=>{

    let user_token:string|string[]  |undefined=(socket.handshake.headers.authorization) ;
   
   console.log("user connect line 59 socket")
         console.log("token")
         console.log(user_token)
    if(user_token && typeof(user_token)==="string"){
       user_token=user_token.split(" ")[1];
       
       users.set(socket.id,user_token);   // token m  s bearer hatake user map m socketid k saath token daala.    
      console.log("yeh sockeet cnonnect hua")
       console.log(socket.id)
        // know start fetching the _id of that user of db and then store it with the instance of that socket.
       const curr_user=jwt.verify(user_token,process.env.ACCESS_TOKEN_SECRET!)as user_type
        sockets.set(curr_user._id,socket); // succesfully mapped the socket instance with users id
    }
       
    socket.on("UNFOLLOW",async({receiverid}:{receiverid:string})=>{

        console.log("socket coming 72")

        const user=await User.findOne({Uid:receiverid}); // receiver
        
        const sender_user=users.get(socket.id);  // get token of user

        console.log("yeh unfollow bhej rha h")
        console.log(socket.id)

        console.log("recevierid")
        console.log(receiverid)
        console.log("sender_user")
        console.log(sender_user)

        let flag:boolean=false

        if(sender_user && user){
            console.log("79")
        const curr_user=jwt.verify(sender_user,process.env.ACCESS_TOKEN_SECRET!)as user_type

        // user?.friendsList?.includes({friend:isBlock:false}) 

        user.friendsList?.map((e)=>{
            if(e.friend.toString()===curr_user._id){
                flag=true
            }
            return;
        })
            
        await User.updateOne({_id:curr_user._id},{
            $pull:{friendsList:{"friend":user?._id}}
        })
            
        await User.updateOne({_id:user && user._id},{
            $pull:{friendsList:{"friend":curr_user._id}}
        })
        console.log("101")
        console.log(flag)
        socket.emit("unfollow",flag);
    }
       else{
        console.log("line 92")
        return;
       }
    })


      // when new user join everybody gets to know.

    socket.on("joinRoom",async(obj)=>{

        const {name}:{name:string}=obj;

        socket.join(name); // try to pass unique name from frontend.
        const curr_user_token:string=users.get(socket.id)||"";
        
        const user:user=(jwt.verify(curr_user_token,process.env.ACCESS_TOKEN_SECRET!))as user;
        
        io.to(name).emit("newuserJoined",{name:user.name,avatar:user.avatar}); 
    })
  
    // msg sent in group or individual

    socket.on("newTextMessage",async(obj)=>{

        const curr_user_token:string=users.get(socket.id)||"";  // hash map s user ka token leerhe h
        
        const sender_user:user=(jwt.verify(curr_user_token,process.env.ACCESS_TOKEN_SECRET!))as user; // client or sender
            // sender ki _id nikali

            const {input,Uid}=obj;  
            
           const receiver_user=await User.findOne({Uid:Uid}).select("_id isActive"); // recevier ki id nikali

           const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-GB");
const formattedTime = currentDate.toLocaleTimeString("en-GB", { hour12: false });
const formattedDateTime = `${formattedDate} ${formattedTime}`;
           

           if(!receiver_user?.isActive){
                                               // check if receiver not active.
           await UnreadMessage.updateOne({
                senderId:sender_user._id,
                receiverId:receiver_user?._id,
            },{
                $addToSet:{"messages":{message:input,type:"text",time:formattedDateTime}}
            },{upsert:true})
            return;
        }
        else{

           const msg=await Message.create({
                Senderid:sender_user._id,
                Receiverid:receiver_user._id,  // else message model m daaldo
                message:input,
                type:"text",
                time:formattedDateTime,
            })
            
            let socket_instance:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
             
            if (sockets.has(receiver_user._id.toString())){          // ek specific user ko send krna h msg sender ko hashmap m find krna padega ki kon h
                console.log("sockets map m ache s add hogya tha")       // sockets map m  socket ki instance value h aur key m user ki id h
                socket_instance=sockets.get(receiver_user._id.toString())!;
                return socket_instance.emit("newTextMessage",msg);  // getting new msg as newTextMessage
            }
    
    
        }

        return ;
    })

    socket.on("UserCameOnline",async(uid:string)=>{

        await User.updateOne({Uid:uid},{
            $set:{"isActive":true} })
       
    })

    socket.on("leaveGroup",async(m)=>{
        
        //socket.leave("string") room to leave.

        //find group joined by this user  remove his entry from db and notify all users in the channel with name and avaatr..

     })
 
    

    socket.on("disconnect", async () => {
      
        interface Obj {
            name: string,
            email: string,
            avatar: string,
            Uid: string,
        }
    
        const token: string | undefined = users.get(socket.id);
    
        if (token) {
            const user= (jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET)!))as Obj;
    
            if (typeof user !== "string" && "Uid" in user) {
                const userData = user as Obj; 
                await User.updateOne({ Uid: userData.Uid }, {
                    $set: { "isActive": false },
                });
            }
        }
        users.delete(socket.id);
        console.log("user disconnect");
    });
    
    socket.on("newLike",async({_id}:{_id:string})=>{

      // u will get post ki id hna  in user we do have posts id
      // we finded the user 
      const user=await User.findOne({Posts:_id}).select("friendsList");

      const users=user?.friendsList?.filter((e)=>{
        return sockets.has(e.friend.toString());
      })
    
      if(users){
        users.map((e)=>{
            sockets.get(e.friend.toString())?.join("like");
        })
      }
      io.to("like").emit("newLike",{post_id:_id});
    })

    socket.on("newComment",async ({_id}:{_id:string})=>{

        const user=await User.findOne({Posts:_id}).select("friendsList");

        const users=user?.friendsList?.filter((e)=>{
          return sockets.has(e.friend.toString());
        })
        
        if(users){
          users.map((e)=>{
              sockets.get(e.friend.toString())?.join("comment");
          })
        }
        io.to("comment").emit("newComment",{post_id:_id});

    })


    socket.on("audiomsg",async(obj)=>{
     
        console.log("req aarhi  h audio msg k lie")

        const {Uid,url}=obj as {Uid:string,url:string};

        console.log("url="+url);

        const r_user=await User.findOne({Uid}); // receiver milgaya msg ka.


        const curr_user_token:string=users.get(socket.id)||"";  // socket id s sender find kiya.
  
        const sender_user:user=(jwt.verify(curr_user_token,process.env.ACCESS_TOKEN_SECRET!))as user;

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-GB");
        const formattedTime = currentDate.toLocaleTimeString("en-GB", { hour12: false });
        const formattedDateTime = `${formattedDate} ${formattedTime}`;

        if(r_user && "_id" in r_user ){

            console.log("r_user k paas id h");
        
        if(!r_user.isActive){  
             
            await UnreadMessage.updateOne({
                senderId:sender_user._id,
                receiverId:r_user._id,
            },{$addToSet:{"messages":{message:url,"type":"audio","time":formattedDateTime}}},{upsert:true})
        
            return;
        }
        else{

           const msg=await Message.create({
                Senderid:sender_user._id,
                Receiverid:r_user._id,
                message:url,
                type:"audio",
                time:formattedDateTime,
            })  

             let socket_instance:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
             
            if (sockets.has(r_user._id.toString())){
                console.log("sockets map m ache s add hogya tha")
                socket_instance=sockets.get(r_user._id.toString())!;
                   
                return socket_instance.emit("audiomsg",msg); 
            }
            else{
                console.log("sockts map m ache s add nahi hua tha")
            return;
            }
        } 
        }
        return;
    })              
    
    })
 

}
