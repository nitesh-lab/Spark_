import mongoose from "mongoose";


export interface friendrequest{
    senderid:mongoose.Schema.Types.ObjectId,
    receiverid:mongoose.Schema.Types.ObjectId,
}

const FriendRequestSchema=new mongoose.Schema<friendrequest>({
    senderid:{type:mongoose.Schema.Types.ObjectId},
    receiverid:{type:mongoose.Schema.Types.ObjectId},
  
    
});

export const FriendRequest=mongoose.model<friendrequest>("FriendRequest",FriendRequestSchema);