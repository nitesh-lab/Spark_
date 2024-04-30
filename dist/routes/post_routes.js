"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_router = void 0;
const express_1 = require("express");
const verifyJWT_1 = __importDefault(require("../services/verifyJWT"));
const post_controller_1 = require("../Controller/post_controller");
exports.post_router = (0, express_1.Router)();
exports.post_router.post("/like", verifyJWT_1.default, post_controller_1.handleLike);
exports.post_router.post("/Comment", verifyJWT_1.default, post_controller_1.handleComment);
exports.post_router.post("/getAllComments", verifyJWT_1.default, post_controller_1.getAllComments);
exports.post_router.post("/video", verifyJWT_1.default, post_controller_1.postVideo);
exports.post_router.post("/getAllPosts", verifyJWT_1.default, post_controller_1.getAllPosts);
exports.post_router.post("/Checklike", verifyJWT_1.default, post_controller_1.Checklike);
//# sourceMappingURL=post_routes.js.map