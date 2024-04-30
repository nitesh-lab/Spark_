import { Router } from "express";
import passport from "passport";
import { CheckOfflinePosts, EligibletoFollow, friendrequestAccept, friendrequestReject, getFriendRequests, getNewOfflinePosts, getSingleUser, getUserProfile, handleCheck, handleLogin, handlePost, handleSearch, handleSignup, handlenewFollower } from "../Controller/user_controller";
import { upload } from "../services/multerconfig";
import verifyJWT from "../services/verifyJWT";

export const user_router: Router = Router();

user_router.route("/").get(verifyJWT,getSingleUser);
user_router.route("/google").get(passport.authenticate('google', { scope: ["profile", "email"] }));
user_router.route("/signup").post(upload.single("avatar"),handleSignup);
user_router.route("/login").post(handleLogin);
user_router.route("/check").get(handleCheck);
user_router.route("/post").post(verifyJWT,upload.single("photo"),handlePost);
user_router.route("/search").post(verifyJWT,handleSearch);
user_router.route("/userProfile").post(verifyJWT,getUserProfile);
user_router.route("/newFollower").post(verifyJWT,handlenewFollower);
user_router.route("/friendrequestAccept").post(verifyJWT,friendrequestAccept);
user_router.route("/friendrequestReject").post(verifyJWT,friendrequestReject);
user_router.route("/getFriendRequests").get(verifyJWT,getFriendRequests);
user_router.route("/checkEligible").post(verifyJWT,EligibletoFollow);
user_router.route("/CheckOfflinePosts").get(verifyJWT,CheckOfflinePosts);
user_router.route("/getNewOfflinePosts").post(verifyJWT,getNewOfflinePosts);
