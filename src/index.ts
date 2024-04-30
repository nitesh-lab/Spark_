import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import { ConnectDB } from "./db/ConnectDB";
import  "./Passport_Setup/passport";
import http from "http";
import { ConnectSocket } from "./services/ConnectSocket";
import "../src/services/createSupabaseclient";
import path from "path";
import express from "express";

export const server=http.createServer(app);

async function startServer():Promise<void> {
    try {
        await ConnectDB();
       
         ConnectSocket(server);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
       
        process.exit(1);
    }

    const port=8000;
    server.listen(process.env.PORT ||port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}


__dirname = path.resolve()

console.log("process.env.NODE_ENV")
console.log(process.env.NODE_ENV)

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'/Spark/dist')))
   
    console.log("production m aagaye")
    app.get('*', (req, res) =>{
      console.log("__dirname"+__dirname);
    
      res.sendFile(path.resolve(__dirname, 'Spark','dist','index.html'))
     const str=path.resolve(__dirname, 'Spark','dist','index.html')   
    })

  }
   else {
    app.get('/', (req, res) => {
      console.log("production m nahi h 76")
      res.send('API is running....')
    })
  }
  console.log("line 85")





startServer();
