import mongoose, { Schema, Document } from "mongoose";

export interface unseenPost extends Document {
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    posts: mongoose.Types.ObjectId[],
}

const UnseenPostSchema = new Schema<unseenPost>({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId,ref:"Post" }],
});

export const UnseenPost = mongoose.model<unseenPost>("UnseenPost",UnseenPostSchema);
