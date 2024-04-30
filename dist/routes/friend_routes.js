"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friend_router = void 0;
const express_1 = require("express");
const verifyJWT_1 = __importDefault(require("../services/verifyJWT"));
const Friend_controller_1 = require("../Controller/Friend_controller");
exports.friend_router = (0, express_1.Router)();
exports.friend_router.route("/getAllFriend").get(verifyJWT_1.default, Friend_controller_1.getAllFriend);
exports.friend_router.route("/addFriend").post(verifyJWT_1.default, Friend_controller_1.addFriend);
exports.friend_router.route("/BlockFriend").post(verifyJWT_1.default, Friend_controller_1.BlockFriend);
exports.friend_router.route("/single").post(verifyJWT_1.default, Friend_controller_1.getSingle);
exports.friend_router.route("/getMessages").post(verifyJWT_1.default, Friend_controller_1.getMessages);
exports.friend_router.route("/notification").post(verifyJWT_1.default, Friend_controller_1.getnotification);
exports.friend_router.route("/getFriendChat").post(verifyJWT_1.default, Friend_controller_1.getFriendChat);
//# sourceMappingURL=friend_routes.js.map