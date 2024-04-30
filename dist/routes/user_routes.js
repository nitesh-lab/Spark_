"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_controller_1 = require("../Controller/user_controller");
const multerconfig_1 = require("../services/multerconfig");
const verifyJWT_1 = __importDefault(require("../services/verifyJWT"));
exports.user_router = (0, express_1.Router)();
exports.user_router.route("/").get(verifyJWT_1.default, user_controller_1.getSingleUser);
exports.user_router.route("/google").get(passport_1.default.authenticate('google', { scope: ["profile", "email"] }));
exports.user_router.route("/signup").post(multerconfig_1.upload.single("avatar"), user_controller_1.handleSignup);
exports.user_router.route("/login").post(user_controller_1.handleLogin);
exports.user_router.route("/check").get(user_controller_1.handleCheck);
exports.user_router.route("/post").post(verifyJWT_1.default, multerconfig_1.upload.single("photo"), user_controller_1.handlePost);
exports.user_router.route("/search").post(verifyJWT_1.default, user_controller_1.handleSearch);
exports.user_router.route("/userProfile").post(verifyJWT_1.default, user_controller_1.getUserProfile);
exports.user_router.route("/newFollower").post(verifyJWT_1.default, user_controller_1.handlenewFollower);
exports.user_router.route("/friendrequestAccept").post(verifyJWT_1.default, user_controller_1.friendrequestAccept);
exports.user_router.route("/friendrequestReject").post(verifyJWT_1.default, user_controller_1.friendrequestReject);
exports.user_router.route("/getFriendRequests").get(verifyJWT_1.default, user_controller_1.getFriendRequests);
exports.user_router.route("/checkEligible").post(verifyJWT_1.default, user_controller_1.EligibletoFollow);
exports.user_router.route("/CheckOfflinePosts").get(verifyJWT_1.default, user_controller_1.CheckOfflinePosts);
exports.user_router.route("/getNewOfflinePosts").post(verifyJWT_1.default, user_controller_1.getNewOfflinePosts);
//# sourceMappingURL=user_routes.js.map