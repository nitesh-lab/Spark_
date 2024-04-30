import mongoose, { Schema, Document } from "mongoose";

export interface unreadMessage extends Document {
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    messages: {message:string,type:string,time:string}[],
}

const UnreadSchema = new Schema<unreadMessage>({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    messages: [{message:{type:String},type:{type:String},time:{type:String}}],
});

export const UnreadMessage = mongoose.model<unreadMessage>("UnreadMessage", UnreadSchema);
