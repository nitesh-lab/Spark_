import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import session from "express-session";
import passport from 'passport';
import { user_router } from './routes/user_routes';
import cookieParser from 'cookie-parser';
import { friend_router } from './routes/friend_routes';
import { post_router } from './routes/post_routes';
import UploadonCloudinary from './services/uploadCloudinary';
export const app=express();

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(cookieParser(process.env.cookie_secret));

app.use(session({
  name:"spark",
  secret:process.env.Session_secret ?? "",
  resave: false ,
  saveUninitialized: true ,
  cookie: {
    maxAge: 3600000, 
    secure: false, 
    httpOnly: false,
  }
}))  


app.use(passport.initialize()) 
app.use(passport.session())  
app.use("/api/user",user_router);
app.use("/api/friend",friend_router);
app.use("/api/post",post_router);

app.get("/api/auth/google", passport.authenticate("google", {
  successRedirect: "/success",
  failureRedirect: "http://localhost:5173/login"
}));

app.get('/success', (req, res) => {
  interface Session {
      passport?: {
        user:{
          accessToken?: string,
          refreshToken?: string,
      }
    }
  }

  const session = req.session as Session;

  const accessToken = session?.passport?.user?.accessToken;
  const refreshToken = session?.passport?.user?.refreshToken;

  if (accessToken && refreshToken) {
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
  }
  res.redirect('http://localhost:5173');
});

app.post("/api/cloud",async(req:Request,res:Response)=>{

  const {file}=(req.body) as {file:string}

  const result:string|null=await UploadonCloudinary(file);

  res.status(200).json({"message":result?result:""});
})