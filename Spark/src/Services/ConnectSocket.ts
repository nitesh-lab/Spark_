import { io } from "socket.io-client";

export const socket= io("https://spark-9j9e.onrender.com",{
    withCredentials:true,
    autoConnect:false,
});

export default function ConnectSocket(token:string){

    socket.io.opts.extraHeaders={
        Authorization:`Bearer ${token}`,
    }
    socket.connect();
}