import { io } from "socket.io-client";

export const socket= io("http://localhost:3000",{
    withCredentials:true,
    autoConnect:false,
});

export default function ConnectSocket(token:string){

    socket.io.opts.extraHeaders={
        Authorization:`Bearer ${token}`,
    }
    socket.connect();
}