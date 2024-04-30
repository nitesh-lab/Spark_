"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRouter = void 0;
const express_1 = require("express");
const verifyJWT_1 = __importDefault(require("../services/verifyJWT"));
const Group_controller_1 = require("../Controller/Group_controller");
exports.GroupRouter = (0, express_1.Router)();
exports.GroupRouter.route("/").get(verifyJWT_1.default, Group_controller_1.getAllGroup); //verify daaldena
//upload.single("file") when creating also upload group pic
exports.GroupRouter.route("/createGroup").post(verifyJWT_1.default, Group_controller_1.CreateGroup);
exports.GroupRouter.route("/getSingleGroup").post(verifyJWT_1.default, Group_controller_1.getSingleGroup); //verifyJWT
exports.GroupRouter.route("/joinGroup").post(verifyJWT_1.default, Group_controller_1.joinGroup);
exports.GroupRouter.route("/leaveGroup").post(verifyJWT_1.default, Group_controller_1.leaveGroup);
exports.GroupRouter.route("/GetAllUsers").post(verifyJWT_1.default, Group_controller_1.GetAllUsers_Group);
//# sourceMappingURL=Group_routes.js.map