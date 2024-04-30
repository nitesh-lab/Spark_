import { Router } from "express";
import verifyJWT from "../services/verifyJWT";
import { Checklike, getAllComments, getAllPosts, handleComment, handleLike, postVideo } from "../Controller/post_controller";

export const post_router=Router();


post_router.post("/like",verifyJWT,handleLike); 
post_router.post("/Comment",verifyJWT,handleComment); 
post_router.post("/getAllComments",verifyJWT,getAllComments); 
post_router.post("/video",verifyJWT,postVideo); 
post_router.post("/getAllPosts",verifyJWT,getAllPosts); 
post_router.post("/Checklike",verifyJWT,Checklike); 