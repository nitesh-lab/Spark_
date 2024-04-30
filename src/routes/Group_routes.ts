import { Router } from "express";
import verifyJWT from "../services/verifyJWT";
import { CreateGroup, GetAllUsers_Group, getAllGroup, getSingleGroup, joinGroup, leaveGroup } from "../Controller/Group_controller";

export const GroupRouter=Router();

GroupRouter.route("/").get(verifyJWT,getAllGroup); //verify daaldena
                  
//upload.single("file") when creating also upload group pic
GroupRouter.route("/createGroup").post(verifyJWT,CreateGroup);

GroupRouter.route("/getSingleGroup").post(verifyJWT,getSingleGroup); //verifyJWT

GroupRouter.route("/joinGroup").post(verifyJWT,joinGroup);

GroupRouter.route("/leaveGroup").post(verifyJWT,leaveGroup);

GroupRouter.route("/GetAllUsers").post(verifyJWT,GetAllUsers_Group);