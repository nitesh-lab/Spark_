import mongoose, { Schema, Document } from "mongoose";

export interface Group_UnreadMessage extends Document {
    uid: mongoose.Types.ObjectId,
    gid: mongoose.Types.ObjectId,
    messages: string[],
}

const UnreadSchema = new Schema<Group_UnreadMessage>({
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    gid: { type: mongoose.Schema.Types.ObjectId, required: true },
    messages: [{ type: String }],
});

export const UnreadMessage = mongoose.model<Group_UnreadMessage>("UnreadMessage", UnreadSchema);
