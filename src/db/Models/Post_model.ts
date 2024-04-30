import mongoose from "mongoose";

export interface post {
    like?:mongoose.Types.ObjectId[],
    comment: {user:mongoose.Types.ObjectId,comment:string}[];
    text: string;
    photo?: string;
    posted: Date; 
    type:"photo"|"video",
}

const PostSchema =new mongoose.Schema<post>({
    like: [{ type:mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment: [{user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },comment:{type:String}}],
    text: { type: String },
    photo: { type: String },
    posted: { type: Date, default: Date.now } ,
    type:{type:String,required:true}
});

export const Post = mongoose.model("Post", PostSchema);
