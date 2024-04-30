import { Request, Response } from "express";
import { User } from "../db/Models/User_model";
import { user_type } from "../services/verifyJWT";
import { Message, message } from "../db/Models/Message_model";
import getCurrentDateTimeAsString from "../services/getTime";
import { UnreadMessage } from "../db/Models/UnreadMessage_model";
import { use } from "passport";
export async function getAllFriend(req:Request,res:Response){

  const user=req.user as user_type

    interface obj{
        _id:null,
        users:{
            _id:string,
            name:string,
            avatar:string,
            Uid:string,
            isActive:boolean,
            lastSeen:string,
        }
    }

  const users:obj[]=await User.aggregate([
            {
                $match: {

                    "Uid": user.Uid
                }
            },
            {
                $unwind: "$friendsList"
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
                "$project": {
                    "users": { "$arrayElemAt": ["$result", 0] }
                }
            }
        ])

        interface obj2{
                name:string,
                avatar:string,
                Uid:string,
                isActive:boolean,
                lastSeen:string,
                count:number
        }

        let result:obj2[]=[]

        //users have friends 
       
        const MappingPromises= users.map(async (e) => {
            const sender = await UnreadMessage.findOne({ senderId: e.users._id, receiverId: user._id });
            return {  senderUid: e.users.Uid,count: sender?.messages.length };
        });
    
        const Mapping = await Promise.all(MappingPromises); // array h uid k saath coun ka

        const user_map=new Map<string,number|undefined>();

      for(let i=0;i<Mapping.length;i++){
         user_map.set(Mapping[i].senderUid,Mapping[i].count);
      }
      
      users.map((e)=>{ 
        result.push({name:e.users.name,avatar:e.users.avatar,Uid:e.users.Uid,isActive:e.users.isActive,lastSeen:e.users.lastSeen,count:0});
         })

      for(let i=0;i<result.length;i++){
         if(user_map.has(result[i].Uid)){
             result[i].count=user_map.get(result[i].Uid)||0
      }
   }
        return res.status(200).json({"user":result});

    }

    export async function addFriend(req:Request,res:Response){

   const {receiver_id}:{receiver_id:string}=req.body;

}

export async function BlockFriend(req:Request,res:Response){

    //user k friends m jaake uska flag sirf change krde isblock ka
}

export async function getSingle(req:Request,res:Response) {

    console.log(req.body);
    
    const user=await User.findOne({Uid:req.body.Uid}).select("-password  -refreshToken -email -Posts  -groups -friendList")
    return res.status(200).json({"user":user});
}


export async function getMessages(req: Request, res: Response) {
    const { Uid } = req.body; // Receiver id
    const r_user = await User.findOne({ Uid: Uid }); // Receiver
   
    interface MessageObject {
        message: string;
        time: string;
        type: string;
    }
   
    const user = req.user as user_type; // Client

    const messages_right: MessageObject[] = await Message.find({ Senderid: user._id, Receiverid: r_user?._id })
        .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
    const messages_left: MessageObject[] = await Message.find({ Senderid: r_user?._id, Receiverid: user?._id })
        .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");


    const messages_right_with_pos: (MessageObject & { pos: string })[] = messages_right.map((e:MessageObject) => {
        return {message: e.message , type:e.type,time:e.time ,pos: "receive" };
    });

    const messages_left_with_pos: (MessageObject & { pos: string })[] = messages_left.map((e) => {
        return { message:e.message,type:e.type,time:e.time, pos: "send" };
    });

    
    const mergedMessages =[...messages_left_with_pos,...messages_right_with_pos];

    for(let i=0;i<mergedMessages.length;i++){

        for(let j=i+1;j<mergedMessages.length;j++){
            
            if(Calc(mergedMessages[i].time)<Calc(mergedMessages[j].time)){ 
                
                let temp:MessageObject&{"pos":string}=mergedMessages[i];
                mergedMessages[i]=mergedMessages[j];
                mergedMessages[j]=temp;
            }
        }
    }

  
    return res.status(200).json({ messages: mergedMessages });
}


function Calc(dateString: string) {
    const currentDate = getCurrentDateTimeAsString(); // Get current date and time
    const [currentDatePart, currentTimePart] = currentDate.split(' '); // Split current date and time
    const [currentDay, currentMonth, currentYear] = currentDatePart.split('-').map(Number); // Parse current date
    const [currentHours, currentMinutes, currentSeconds] = currentTimePart.split(':').map(Number); // Parse current time


    const [datePart, timePart] = dateString.split(' '); // Split provided date and time
    const [day, month, year] = datePart.split('/').map(Number); // Parse provided date
    const [hours, minutes, seconds] = timePart.split(':').map(Number); // Parse provided time

    // Calculate the difference in seconds
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    const providedTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
    const currentDateTimeInSeconds = currentDay * 86400 + currentMonth * 2592000 + currentYear * 31104000 + currentTimeInSeconds;
    const providedDateTimeInSeconds = day * 86400 + month * 2592000 + year * 31104000 + providedTimeInSeconds;

    return currentDateTimeInSeconds - providedDateTimeInSeconds;
}

export async function getnotification(req: Request, res: Response) {
    const user = req.user as user_type;

    interface obj {
        _id: string;
        friend: {
            _id: string;
            name: string;
            avatar: string;
            lastSeen: string;
            Uid: string;
        };
    }

    const friends: obj[] = await User.aggregate([
        {
            $match: {
                "Uid": user.Uid,
            },
        },
        {
            $unwind: "$friendsList",
        },
        {
            $lookup: {
                from: "users",
                localField: "friendsList.friend",
                foreignField: "_id",
                as: "result",
            },
        },
        {
            $project: {
                "friend": { $arrayElemAt: ["$result", 0] },
            },
        },
    ]);

    const MappingPromises= friends.map(async (e) => {
        const sender = await UnreadMessage.findOne({ senderId: e.friend._id, receiverId: user._id });
        return {  senderUid: e.friend.Uid,count: sender?.messages.length };
    });

    const Mapping = await Promise.all(MappingPromises);

        return res.status(200).json({ "notifications": Mapping });
}


export async function getFriendChat(req:Request,res:Response) {

 
interface MessageObject {
    message: string;
    time: string;
    type: string;
    pos?:string;
}

    const {Uid,time}=req.body; // receiver

    const user=req.user as user_type 

    const r_user=await User.findOne({Uid:Uid});
   
    interface msg{
        _id:string,
        messages:MessageObject,
    }

    if(time){

        console.log("time h");

      let messages_time:msg[];

        messages_time=await UnreadMessage.aggregate<{_id:string,messages:MessageObject}>([
            {
              $match: {
                senderId: r_user?._id,
                receiverId:user._id,
              }
            },
            {
              $unwind: "$messages"
            },
            {
              $match:{
                "messages.time":{$lt:new Date(time)}
              }
            }
          ])  // yaha ttak sirf  uss time  k upar k docs nikale
          console.log("more data line 267")
          console.log(messages_time);

          if(messages_time.length>0){

            console.log("line 270")

            let result:{message:string,type:string,time:string,pos:"receive"}[]=[];
                const length:number|undefined=messages_time.length
        
            if(length && length>10){
                messages_time.map((e)=>{
                    result.push({message:e.messages.message,type:e.messages.type,time:e.messages.time,pos:"receive"});
                })
                console.log("more than 10 docs h line 281")
            
                
                const bw=messages_time.map((e)=>{  // bulkwrite those top 10 messages into message model.
                    return { 
                         insertOne:{
            document:{Senderid:r_user?._id,Receiverid:user._id,message:e.messages.message,type:e.messages.type,time:e.messages.time }
                         }
                       }
                     })
                 
                     try {
                         const result_write = await Message.bulkWrite(bw);
                         console.log("Inserted successfully:", result_write);
                         
                        await UnreadMessage.updateOne(
                            { senderId: r_user?._id, receiverId: user._id },
                            {
                              $pull: {
                                messages: {
                                  $each: [],
                                  $slice: 10
                                }
                              }
                            }
                          );
                          
                        // delete only 10

                         result.sort((a,b)=>{
                            return Calc(b.time)-Calc(a.time)
                        })

                        return res.status(200).json({"messages":result})
                        
                    } catch (err) {
                         console.error("Error inserting messages:", err);
                     }
                     console.log("length 10 s jyada unread ka"+result);
           
            }
            else if(length>0){
                    console.log("line 323")
            let result:{message:string,type:string,time:string,pos:"send"|"receive"}[]=[];
        
                messages_time.map((e)=>{
                    result.push({message:e.messages.message,type:e.messages.type,time:e.messages.time,pos:"send"});
                })  // result m add 10-x messages
        
                console.log("less than 10")
                console.log("woh less than 10 unread msg h "+result);
               
               const bw=messages_time.map((e)=>{
               return { 
                    insertOne:{
                        document:{Senderid:r_user?._id,Receiverid:user._id,message:e.messages.message,type:e.messages.type,time:e.messages.time }
                    }
                  }
                })
            
            // hum with time k andar h. abb agar undread 5 h aur baaki k 5 message model s 
            // chahiye toh hume msg model m $lt chaiye rhega last unseen ka time kaha tak hua tha waha s naaki starting k koi bhi 5

                try {
                    const result = await Message.bulkWrite(bw);
                    console.log("Inserted successfully:", result);
                    await UnreadMessage.deleteOne({senderId:r_user?._id,receiverId:user._id});
                } catch (err) {
                    console.error("Error inserting messages:", err);
                }
                
            const tofetch:number=10-messages_time.length;
        
                  // as documents are sorted by time result[0] should contain the least recent time of msg.
                  let leastRecentTime=result[0].time;
                
                  console.log("kis time s try kr rhe h fetch krne ka seen message m s"+leastRecentTime);

            const messages_right: MessageObject[] = await Message.find({ Senderid: user._id, Receiverid: r_user?._id,time:{$lt:leastRecentTime} })
                .sort({ "time": -1 }).limit(tofetch/2).select("-Receiverid -Senderid");
            const messages_left: MessageObject[] = await Message.find({ Senderid: r_user?._id, Receiverid: user?._id,time:{$lt:leastRecentTime} })
                .sort({ "time": -1 }).limit(tofetch/2).select("-Receiverid -Senderid");
        
             const messages_right_with_pos: (MessageObject & { pos: string })[] = messages_right.map((e:MessageObject) => {
                    return {message: e.message , type:e.type,time:e.time ,pos: "receive" };
                });
            
             const messages_left_with_pos: (MessageObject & { pos: string })[] = messages_left.map((e) => {
                    return { message:e.message,type:e.type,time:e.time, pos: "send" };
                });
            
                const mergedMessages =[...result,...messages_left_with_pos,...messages_right_with_pos];
            
                    mergedMessages.sort((a,b)=>{
                        return Calc(b.time)-Calc(a.time)
                    })
             
                    console.log("after sort complete array looks like msg lessthan 10 aur time bhi h"+mergedMessages)
                return res.status(200).json({"messages":mergedMessages});
                }     
  }
             else{
        
                console.log("line 384")

                const messages_right: MessageObject[] = await Message.find({ Senderid: user._id, Receiverid: r_user?._id,time:{$lt:time} })
                .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
            const messages_left: MessageObject[] = await Message.find({ Senderid: r_user?._id, Receiverid: user?._id,time:{$lt:time} })
                .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
                
                console.log()

             const messages_right_with_pos: (MessageObject & { pos: string })[] = messages_right.map((e:MessageObject) => {
                    return {message: e.message , type:e.type,time:e.time ,pos: "receive" };
                });
            
             const messages_left_with_pos: (MessageObject & { pos: string })[] = messages_left.map((e) => {
                    return { message:e.message,type:e.type,time:e.time, pos: "send" };
                });
            
                const mergedMessages =[...messages_left_with_pos,...messages_right_with_pos];
            
                    mergedMessages.sort((a,b)=>{
                        return Calc(b.time)-Calc(a.time)
                    })
                    console.log("no unseen message + time diya tha sab seen m s aarhe h")
                    return res.status(200).json({"messages":mergedMessages});
             }
    }
    else{

        let messages_notime;


        console.log("time nahi diya h kuch bhi")

        messages_notime=await UnreadMessage.findOne({senderId:r_user?._id,receiverId:user._id}).select("messages")
 
        if(messages_notime){

            
    let result:{message:string,type:string,time:string,pos:"receive"}[]=[];
        const length:number|undefined=messages_notime?.messages.length;

    if(length && length>10){

        console.log("unseen 10 s jyada h notime "+messages_notime)
        messages_notime.messages.map((e)=>{
            result.push({message:e.message,type:e.type,time:e.time,pos:"receive"});
        })
        console.log("more than 10")
        console.log(messages_notime); 
        
        const bw=messages_notime.messages.map((e)=>{  // bulkwrite those top 10 messages into message model.
            return { 
                 insertOne:{
                     document:{Senderid:r_user?._id,Receiverid:user._id,message:e.message,type:e.type,time:e.time }
                 }
               }
             })
         
             try {
                 const result_write = await Message.bulkWrite(bw);
                 console.log("Inserted successfully:", result_write);
                 await UnreadMessage.deleteOne({senderId:r_user?._id,receiverId:user._id});

                 result.sort((a,b)=>{
                    return Calc(b.time)-Calc(a.time)
                })

                return res.status(200).json({"messages":result});
                } catch (err) {
                 console.error("Error inserting messages:", err);
             }
   
    }
    else if(length>0){
        let result:{message:string,type:string,time:string,pos:"send"|"receive"}[]=[];

        messages_notime.messages.map((e)=>{
            result.push({message:e.message,type:e.type,time:e.time,pos:"send"});
        })  // result m add 10-x messages

        console.log("less than 10 with notime")

       const bw=messages_notime.messages.map((e)=>{
       return { 
            insertOne:{
                document:{Senderid:r_user?._id,Receiverid:user._id,message:e.message,type:e.type,time:e.time }
            }
          }
        })
    
        try {
            const result_w = await Message.bulkWrite(bw);
            console.log("Inserted successfully:", result_w);
            await UnreadMessage.deleteOne({senderId:r_user?._id,receiverId:user._id});
        } catch (err) {
            console.error("Error inserting messages:", err);
        }
        

        const tofetch:number=10-messages_notime.messages.length;

        const leastfrequentmsg:string=result[0].time;

    const messages_right: MessageObject[] = await Message.find({ Senderid: user._id, Receiverid: r_user?._id ,time:{$lt:leastfrequentmsg}})
        .sort({ "time": -1 }).limit(tofetch).select("-Receiverid -Senderid");

    const messages_left: MessageObject[] = await Message.find({ Senderid: r_user?._id, Receiverid: user?._id,time:{$lt:leastfrequentmsg}})
   .sort({ "time": -1 }).limit(tofetch).select("-Receiverid -Senderid");

     const messages_right_with_pos: (MessageObject & { pos: string })[] = messages_right.map((e:MessageObject) => {
            return {message: e.message , type:e.type,time:e.time ,pos: "receive" };
        });
    
     const messages_left_with_pos: (MessageObject & { pos: string })[] = messages_left.map((e) => {
            return { message:e.message,type:e.type,time:e.time, pos: "send" };
        });
    
        const mergedMessages =[...result,...messages_left_with_pos,...messages_right_with_pos];
    
            mergedMessages.sort((a,b)=>{
                return Calc(b.time)-Calc(a.time)
            })
                console.log("total msg with someunread +some msg line 495 "+mergedMessages)

                return res.status(200).json({"messages":mergedMessages});
        }     

    }
     else{

        const messages_right: MessageObject[] = await Message.find({ Senderid: user._id, Receiverid: r_user?._id })
        .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
    const messages_left: MessageObject[] = await Message.find({ Senderid: r_user?._id, Receiverid: user?._id })
        .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");

     const messages_right_with_pos: (MessageObject & { pos: string })[] = messages_right.map((e:MessageObject) => {
            return {message: e.message , type:e.type,time:e.time ,pos: "receive" };
        });
    
     const messages_left_with_pos: (MessageObject & { pos: string })[] = messages_left.map((e) => {
            return { message:e.message,type:e.type,time:e.time, pos: "send" };
        });
    
        const mergedMessages =[...messages_left_with_pos,...messages_right_with_pos];
    
            mergedMessages.sort((a,b)=>{
                return Calc(b.time)-Calc(a.time)
            })  
            console.log("no unseen no time 521")
            console.log(mergedMessages)
            return res.status(200).json({"messages":mergedMessages});
         }
    }

    return res.status(200).json({"message":1});
}