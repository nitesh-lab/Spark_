import mongoose, { Document, Schema, Types } from "mongoose";

interface UserReference {
    user: mongoose.Types.ObjectId;
    isAdmin?: boolean;
    isBlock?:boolean,
}

export interface Group extends Document {
    name: string,
    users: UserReference[],
    gid: string,
    groupPhoto?: string,
    messages:Array<string>
}

const GroupSchema = new Schema<Group>({
    name: {
        type: String,
        required: true
    },
    users: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isAdmin: { type: Boolean },
        isBlock:{type:Boolean},
    }],
    gid: {
        type: String,
        unique: true
    },
    groupPhoto: {
        type: String
    },
    messages:[{type:String}],
    
}, { timestamps: true });

export const GroupModel = mongoose.model<Group>("Group", GroupSchema);
