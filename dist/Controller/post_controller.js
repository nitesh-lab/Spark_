"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.postVideo = exports.getAllComments = exports.handleComment = exports.Checklike = exports.handleLike = void 0;
const Post_model_1 = require("../db/Models/Post_model");
const mongoose_1 = __importDefault(require("mongoose"));
const uploadCloudinary_1 = __importDefault(require("../services/uploadCloudinary"));
const User_model_1 = require("../db/Models/User_model");
function handleLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const { post_id } = req.body;
        const existingLike = yield Post_model_1.Post.findOne({ _id: post_id, like: user._id });
        if (existingLike) {
            return res.status(200).json({ "state": false });
        }
        else {
            yield Post_model_1.Post.updateOne({ _id: post_id }, {
                $addToSet: { like: user._id }
            });
            return res.status(200).json({ "state": false });
        }
    });
}
exports.handleLike = handleLike;
function Checklike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const { post_id } = req.body;
        const existingLike = yield Post_model_1.Post.findOne({ _id: post_id, like: user._id });
        if (existingLike) {
            return res.status(200).json({ "state": false });
        }
        else {
            return res.status(200).json({ "state": true });
        }
    });
}
exports.Checklike = Checklike;
function handleComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const { post_id, comment } = req.body;
        yield Post_model_1.Post.updateOne({ _id: post_id }, {
            $push: { comment: { user: user._id, comment: comment } }
        });
        res.status(200).json({ "message": "done" });
    });
}
exports.handleComment = handleComment;
function getAllComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { post_id } = req.body;
        const comments_result = yield Post_model_1.Post.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(post_id) // Convert post_id to ObjectId
                }
            },
            {
                $unwind: "$comment"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comment.user",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $project: {
                    "comment": "$comment.comment",
                    "user": { $arrayElemAt: ["$result", 0] }
                }
            }
        ]);
        let result = [];
        comments_result.map((e) => {
            result.push({ Uid: e.user.Uid, avatar: e.user.avatar, name: e.user.name, comment: e.comment });
        });
        return res.status(200).json({ "user": result });
    });
}
exports.getAllComments = getAllComments;
function postVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, type } = req.body;
        if (url) {
            const result = yield (0, uploadCloudinary_1.default)(url);
            return res.status(200).json({ "url": result });
        }
        else {
            return res.status(400).json({ "message": "No url provided" });
        }
    });
}
exports.postVideo = postVideo;
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Uid } = req.body;
        const result = yield User_model_1.User.aggregate([
            {
                $match: {
                    "Uid": Uid,
                },
            },
            {
                $unwind: "$Posts",
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "Posts",
                    foreignField: "_id",
                    as: "result"
                },
            },
            {
                $project: {
                    "result": { $arrayElemAt: ["$result", 0] },
                }
            }
        ]);
        let result_copy = [];
        console.log("line 160");
        result.map((e) => {
            result_copy.push({ post_id: e.result._id, like: e.result.like || [], comment: e.result.comment, text: e.result.text, photo: e.result.photo, posted: e.result.posted, type: e.result.type });
        });
        return res.status(200).json({ "posts": result_copy });
    });
}
exports.getAllPosts = getAllPosts;
//# sourceMappingURL=post_controller.js.map