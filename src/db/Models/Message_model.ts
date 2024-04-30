import mongoose, { Schema, Document } from "mongoose";

export interface message{
   Senderid:mongoose.Schema.Types.ObjectId,
   Receiverid:mongoose.Schema.Types.ObjectId,
   message:string,
   type:string,
   time:string,
}

const MessageSchema=new mongoose.Schema<message>({
    Senderid:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   Receiverid:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   message:{type:String},
   type:{type:String},
   time:{type:String},
});

export const Message=mongoose.model<message>("Message",MessageSchema);