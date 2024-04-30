import { Router } from "express";
import verifyJWT from "../services/verifyJWT";
import { BlockFriend, addFriend, getAllFriend, getFriendChat, getMessages, getSingle, getnotification } from "../Controller/Friend_controller";

export const friend_router=Router();


friend_router.route("/getAllFriend").get(verifyJWT,getAllFriend);

friend_router.route("/addFriend").post(verifyJWT,addFriend);

friend_router.route("/BlockFriend").post(verifyJWT,BlockFriend);
friend_router.route("/single").post(verifyJWT,getSingle);

friend_router.route("/getMessages").post(verifyJWT,getMessages);
friend_router.route("/notification").post(verifyJWT,getnotification);
friend_router.route("/getFriendChat").post(verifyJWT,getFriendChat);


