import mongoose from "mongoose";
 
export async function ConnectDB():Promise<void>{
    try {
        await mongoose.connect(`mongodb+srv://niteshsemwal15:${process.env.MONGO_PASS}@nitesh.m1jhswm.mongodb.net/?retryWrites=true&w=majority&appName=Nitesh`);
        console.log("mongo connected");
    }
    catch(e){
        console.log(e);
    }

}
