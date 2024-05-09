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
exports.getNewOfflinePosts = exports.CheckOfflinePosts = exports.EligibletoFollow = exports.getFriendRequests = exports.friendrequestReject = exports.friendrequestAccept = exports.handlenewFollower = exports.getUserProfile = exports.handleSearch = exports.handlePost = exports.getSingleUser = exports.handleCheck = exports.RefreshAccessToken = exports.handleLogin = exports.handleSignup = void 0;
const User_model_1 = require("../db/Models/User_model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const UploadSupabase_1 = require("../services/UploadSupabase");
const getTime_1 = __importDefault(require("../services/getTime"));
const FriendRequest_model_1 = require("../db/Models/FriendRequest_model");
const ConnectSocket_1 = require("../services/ConnectSocket");
const Unread_post_1 = require("../db/Models/Unread_post");
const Post_model_1 = require("../db/Models/Post_model");
function handleSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            const existingUser = yield User_model_1.User.findOne({ $or: [{ name }, { email }] });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No avatar provided" });
            }
            const result = yield (0, UploadSupabase_1.uploadFileToSupabaseBucket)(req.file.path);
            if (result) {
                const user = yield User_model_1.User.create({
                    Uid: (0, uuid_1.v4)(),
                    name,
                    email,
                    password,
                    avatar: process.env.supabase_bucket + result.path,
                    lastSeen: new Date().toISOString(),
                });
                const createdUser = yield User_model_1.User.findById(user._id).select("-password -refreshToken");
                return res.status(201).json({ message: "Inserted successfully" });
            }
        }
        catch (error) {
            console.error("Error signing up:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.handleSignup = handleSignup;
function handleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, checked } = req.body;
            const user = yield User_model_1.User.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ message: "NO SUCH USER" });
            }
            const isCorrect = user.isPasswordCorrect ? password : false;
            if (!isCorrect) {
                return res.status(401).json({ message: "Wrong password" });
            }
            if (isCorrect) {
                const accessToken = user.generateAccessToken ? user.generateAccessToken() : "";
                const refreshToken = user.generateSecretToken ? user.generateSecretToken() : "";
                user.refreshToken = refreshToken;
                yield user.save({ validateBeforeSave: false });
                const loggedinUser = yield User_model_1.User.findById(user._id).select("-refreshToken -password");
                req.session.user_access = accessToken;
                console.log("line 120 ");
                console.log(accessToken);
                if (accessToken && refreshToken) {
                    res.cookie("accessToken", accessToken);
                    res.cookie("refreshToken", refreshToken);
                }
                res.redirect('https://spark-9j9e.onrender.com');
            }
        }
        catch (error) {
            console.error("Error logging in:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.handleLogin = handleLogin;
function RefreshAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies.refreshtoken;
        try {
            if (!refreshToken) {
                return res.status(400).json({ message: "No Refresh Token provided" });
            }
            const decodedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.RefreshTokenSecret);
            const user = yield User_model_1.User.findById(decodedToken._id);
            if (!user) {
                return res.status(400).json({ message: "Incorrect Refresh Token" });
            }
            const accessToken = user.generateAccessToken ? user.generateAccessToken() : "";
            const newRefreshToken = user.generateSecretToken ? user.generateSecretToken() : "";
            user.refreshToken = newRefreshToken;
            yield user.save({ validateBeforeSave: false });
            return res.status(200)
                .cookie("accessToken", accessToken)
                .cookie("refreshtoken", newRefreshToken)
                .json({ accessToken, message: "Token refreshed successfully" });
        }
        catch (error) {
            console.error("Error refreshing access token:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.RefreshAccessToken = RefreshAccessToken;
function handleCheck(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.accessToken) {
            return res.status(200).json({ accessToken: req.cookies.accessToken });
        }
        const session = req.session;
        if (session && session.passport && "accessToken" in session.passport) {
            return res.status(200).json({ accessToken: session.passport.accessToken });
        }
        else {
            return res.status(401).json({ accessToken: "" });
        }
    });
}
exports.handleCheck = handleCheck;
function getSingleUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.user) {
            const { Uid, name, email, avatar } = req.user;
            const user = yield User_model_1.User.findOne({ Uid: Uid });
            return res.status(200).json({
                "user": {
                    Uid: Uid,
                    name: name,
                    email: email,
                    avatar: avatar,
                    followers: (user === null || user === void 0 ? void 0 : user.friendsList) ? user.friendsList.length : 0
                }
            });
        }
        else {
            return res.status(401).json({ "user": {} });
        }
    });
}
exports.getSingleUser = getSingleUser;
function handlePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Uid, text, video } = req.body;
            const senderUser = yield User_model_1.User.findOne({ Uid });
            if (video && typeof (video) === "string") {
                if (!senderUser) {
                    throw new Error("Sender user not found.");
                }
                const user = yield Post_model_1.Post.create({
                    text: text,
                    photo: video,
                    posted: (0, getTime_1.default)(),
                    type: "video"
                });
                yield User_model_1.User.updateOne({ Uid }, { $push: { "Posts": user._id } });
                const friends = yield User_model_1.User.aggregate([
                    {
                        $match: { "Uid": Uid }
                    },
                    {
                        $lookup: {
                            "from": "users",
                            "localField": "friendsList.friend",
                            "foreignField": "_id",
                            "as": "result"
                        }
                    },
                    {
                        $unwind: "$result"
                    },
                    {
                        $project: {
                            "friendId": "$result._id",
                            "name": "$result.name",
                            "avatar": "$result.avatar",
                            "Uid": "$result.Uid"
                        }
                    }
                ]);
                if (friends && friends.length > 0) {
                    const bulkOps = friends.map((e) => {
                        return {
                            updateOne: {
                                filter: { senderId: senderUser._id, receiverId: e.friendId },
                                update: { $push: { "posts": user._id } },
                                upsert: true,
                            }
                        };
                    });
                    yield Unread_post_1.UnseenPost.bulkWrite(bulkOps);
                }
                return res.status(200).json({ message: "Post created successfully.", data: user });
            }
            else {
                if (!(req.file && req.file.path)) {
                    throw new Error("No file uploaded.");
                }
                const result = yield (0, UploadSupabase_1.uploadFileToSupabaseBucket)(req.file.path);
                if (!result || !result.path) {
                    throw new Error("Failed to upload file to Supabase.");
                }
                if (!senderUser) {
                    throw new Error("Sender user not found.");
                }
                const user = yield Post_model_1.Post.create({
                    text: text,
                    photo: process.env.supabase_bucket + result.path,
                    posted: (0, getTime_1.default)(),
                    type: "photo"
                });
                yield User_model_1.User.updateOne({ Uid }, { $push: { "Posts": user._id } });
                const friends = yield User_model_1.User.aggregate([
                    {
                        $match: { "Uid": Uid }
                    },
                    {
                        $lookup: {
                            "from": "users",
                            "localField": "friendsList.friend",
                            "foreignField": "_id",
                            "as": "result"
                        }
                    },
                    {
                        $unwind: "$result"
                    },
                    {
                        $project: {
                            "friendId": "$result._id",
                            "name": "$result.name",
                            "avatar": "$result.avatar",
                            "Uid": "$result.Uid"
                        }
                    }
                ]);
                if (friends && friends.length > 0) {
                    const bulkOps = friends.map((e) => {
                        return {
                            updateOne: {
                                filter: { senderId: senderUser._id, receiverId: e.friendId },
                                update: { $push: { "posts": user._id } },
                                upsert: true,
                            }
                        };
                    });
                    yield Unread_post_1.UnseenPost.bulkWrite(bulkOps);
                }
                return res.status(200).json({ message: "Post created successfully.", data: user });
            }
        }
        catch (error) {
            console.error("Error handling post:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    });
}
exports.handlePost = handlePost;
function handleSearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.body;
        try {
            // Perform a case-insensitive search using a regex
            const users = yield User_model_1.User.find({ name: { $regex: new RegExp(name, 'i') } }).select("name avatar Uid");
            if (users.length > 0) {
                return res.status(200).json({ users: users });
            }
            else {
                return res.status(200).json({ users: [] });
            }
        }
        catch (error) {
            console.error("Error searching for users:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    });
}
exports.handleSearch = handleSearch;
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Uid } = req.body;
        const user = yield User_model_1.User.findOne({ Uid: Uid });
        if (user && "name" in user && "email" in user && "avatar" in user) {
            const { name, email, avatar } = user;
            return res.status(200).json({
                "user": {
                    Uid: Uid,
                    name: name,
                    email: email,
                    avatar: avatar,
                    followers: (user === null || user === void 0 ? void 0 : user.friendsList) ? user.friendsList.length : 0
                }
            });
        }
        else {
            return res.status(400).json({ "message": "something wrong with profile" });
        }
    });
}
exports.getUserProfile = getUserProfile;
function handlenewFollower(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverid } = req.body;
        let sendid;
        if (req && req.user && "Uid" in req.user && typeof (req.user.Uid) === "string") {
            const senderid = (req.user.Uid);
            sendid = senderid;
            const sender = yield User_model_1.User.findOne({ Uid: senderid });
            const receiver = yield User_model_1.User.findOne({ Uid: receiverid });
            if ((_a = receiver === null || receiver === void 0 ? void 0 : receiver.friendsList) === null || _a === void 0 ? void 0 : _a.includes(sender === null || sender === void 0 ? void 0 : sender._id)) {
                return res.status(200).json({ "message": "already a follower" });
            }
            const result = yield FriendRequest_model_1.FriendRequest.create({
                senderid: sender === null || sender === void 0 ? void 0 : sender._id,
                receiverid: receiver === null || receiver === void 0 ? void 0 : receiver._id,
            });
            ConnectSocket_1.emitter.emit("newFriendRequest", { sender: sendid, receiver: receiverid });
            return res.status(200).json({ "message": "done" });
        }
        else {
            return res.status(400).json({ "message": "bad request" });
        }
    });
}
exports.handlenewFollower = handlenewFollower;
function friendrequestAccept(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { Uid } = req.body;
            if (Uid) {
                const user_2 = yield User_model_1.User.findOne({ Uid: Uid });
                if (user_2) {
                    yield FriendRequest_model_1.FriendRequest.deleteMany({ senderid: user_2._id, receiverid: (_a = user === null || user === void 0 ? void 0 : user._id) !== null && _a !== void 0 ? _a : "" });
                    yield User_model_1.User.updateOne({ Uid: Uid }, {
                        $push: { "friendsList": { friend: (_b = user === null || user === void 0 ? void 0 : user._id) !== null && _b !== void 0 ? _b : "", isBlock: false } },
                    });
                    yield User_model_1.User.updateOne({ _id: (_c = user === null || user === void 0 ? void 0 : user._id) !== null && _c !== void 0 ? _c : "" }, {
                        $push: { "friendsList": { friend: user_2._id, isBlock: false } },
                    });
                    return res.status(200).json({ "message": "done" });
                }
                else {
                    return res.status(404).json({ "message": "User not found" });
                }
            }
            else {
                return res.status(400).json({ "message": "No Uid provided" });
            }
        }
        catch (error) {
            console.error("Error accepting friend request:", error);
            return res.status(500).json({ "message": "Internal Server Error" });
        }
    });
}
exports.friendrequestAccept = friendrequestAccept;
function friendrequestReject(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Uid } = req.body;
            const user = req.user;
            if (Uid) {
                const user_2 = yield User_model_1.User.findOne({ Uid: Uid });
                if (user_2) {
                    yield FriendRequest_model_1.FriendRequest.deleteMany({ senderid: user_2._id, receiverid: (_a = user === null || user === void 0 ? void 0 : user._id) !== null && _a !== void 0 ? _a : "" });
                    return res.status(200).json({ "message": "Friend request rejected" });
                }
                else {
                    return res.status(404).json({ "message": "User not found" });
                }
            }
            else {
                return res.status(400).json({ "message": "No Uid provided" });
            }
        }
        catch (error) {
            console.error("Error rejecting friend request:", error);
            return res.status(500).json({ "message": "Internal Server Error" });
        }
    });
}
exports.friendrequestReject = friendrequestReject;
function getFriendRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user; // Assuming user_type is defined somewhere
            if (!user || !user._id) {
                throw new Error("User ID not found");
            }
            const data = yield FriendRequest_model_1.FriendRequest.aggregate([
                {
                    $match: {
                        receiverid: user._id
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "senderid",
                        foreignField: "_id",
                        as: "result"
                    }
                },
                {
                    $project: {
                        "result.name": 1,
                        "result.avatar": 1,
                        "result.Uid": 1,
                    }
                },
                {
                    $group: {
                        _id: null,
                        "users": { $push: "$result" }
                    }
                }
            ]);
            let users = [];
            if (data.length > 0 && data[0].users.length > 0 && data[0].users[0].length > 0) {
                data[0].users.map((e, i) => {
                    users.push({
                        Uid: e[0].Uid,
                        name: e[0].name,
                        avatar: e[0].avatar
                    });
                });
            }
            res.status(200).json({ users: users });
        }
        catch (error) {
            console.error("Error while fetching friend requests:", error);
            res.status(500).json({ error: "Internal Server Error" }); // Sending 500 status in case of error
        }
    });
}
exports.getFriendRequests = getFriendRequests;
function EligibletoFollow(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = "follow"; // Default value
            const { Uid } = req.body;
            const user = req.user; // Client
            if (Uid) {
                const user_2 = yield User_model_1.User.findOne({ Uid: Uid });
                if (user_2 && user_2._id && user) {
                    const friendRequest = yield FriendRequest_model_1.FriendRequest.findOne({ senderid: user._id, receiverid: user_2._id });
                    if (friendRequest) {
                        result = "pending";
                    }
                    else {
                        const isFollowing = (_a = user_2.friendsList) === null || _a === void 0 ? void 0 : _a.some(friend => friend.friend.equals(user._id));
                        if (isFollowing) {
                            result = "following";
                        }
                    }
                }
            }
            res.status(200).json({ "state": result });
        }
        catch (error) {
            console.error("Error determining eligibility to follow:", error);
            res.status(500).json({ "state": "Internal Server Error" });
        }
    });
}
exports.EligibletoFollow = EligibletoFollow;
function CheckOfflinePosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            // Retrieve unseen posts
            const unseenPosts = yield Unread_post_1.UnseenPost.aggregate([
                { $match: { receiverId: user._id } },
                { $unwind: "$posts" },
                { $lookup: { from: "users", localField: "senderId", foreignField: "_id", as: "sender" } },
                { $lookup: { from: "posts", localField: "posts", foreignField: "_id", as: "post" } },
                { $sort: { "post.posted": -1 } },
                { $project: { sender: { $arrayElemAt: ["$sender", 0] }, post: { $arrayElemAt: ["$post", 0] } } },
                { $limit: 3 }
            ]);
            // Retrieve user's own posts
            const userPosts = yield User_model_1.User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$Posts" },
                { $lookup: { from: "posts", localField: "Posts", foreignField: "_id", as: "result" } },
                { $sort: { "result.posted": -1 } },
                { $project: { post: { $arrayElemAt: ["$result", 0] } } },
                { $limit: 3 }
            ]);
            const ans = [];
            // Map unseen posts
            unseenPosts.forEach(e => {
                ans.push({
                    post_id: e.post._id,
                    Uid: e.sender.Uid,
                    name: e.sender.name,
                    comment: e.post.comment,
                    avatar: e.sender.avatar,
                    like: e.post.like.length,
                    text: e.post.text,
                    posted: e.post.posted,
                    photo: e.post.photo,
                    type: e.post.type
                });
            });
            // Map user's own posts
            userPosts.forEach(e => {
                ans.push({
                    post_id: e.post._id,
                    Uid: user.Uid,
                    name: user.name,
                    comment: e.post.comment,
                    avatar: user.avatar,
                    like: e.post.like.length,
                    text: e.post.text,
                    posted: e.post.posted,
                    photo: e.post.photo,
                    type: e.post.type
                });
            });
            return res.status(200).json({ "state": ans.length === 3, posts: ans });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ "error": "Internal Server Error" });
        }
    });
}
exports.CheckOfflinePosts = CheckOfflinePosts;
function getNewOfflinePosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (req.user);
        const { time } = req.body;
        const newposts = yield Unread_post_1.UnseenPost.aggregate([
            {
                $match: {
                    receiverId: user._id
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: "$posts"
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "posts",
                    foreignField: "_id",
                    as: "result2"
                }
            },
            {
                $project: {
                    "sender": { $arrayElemAt: ["$result", 0] },
                    "post": { $arrayElemAt: ["$result2", 0] }
                }
            },
            {
                $match: {
                    "post.posted": { $lt: new Date(time) }
                }
            },
            {
                $sort: { "post.posted": -1 }
            },
            {
                $limit: 3,
            }
        ]);
        const userPosts = yield User_model_1.User.aggregate([
            { $match: { _id: user._id } },
            { $unwind: "$Posts" },
            { $lookup: { from: "posts", localField: "Posts", foreignField: "_id", as: "result" } },
            { $project: { post: { $arrayElemAt: ["$result", 0] } } },
            {
                $match: {
                    "post.posted": { $lt: new Date(time) }
                }
            },
            {
                $sort: { "post.posted": -1 }
            },
            { $limit: 3 }
        ]);
        const result = [];
        userPosts.map((e) => {
            result.push({ post_id: e.post._id, Uid: user.Uid, name: user.name, comment: e.post.comment, avatar: user.avatar,
                like: e.post.like.length, text: e.post.text, posted: e.post.posted, photo: e.post.photo, type: e.post.type
            });
        });
        newposts.map((e) => {
            result.push({ post_id: e.post._id, Uid: e.sender.Uid, name: e.sender.name, comment: e.post.comment,
                avatar: e.sender.avatar, like: e.post.like.length, text: e.post.text, posted: e.post.posted,
                photo: e.post.photo, type: e.post.type });
        });
        if (result.length < 3) {
            return res.status(200).json({ state: false, "user": result });
        }
        return res.status(200).json({ state: true, "user": result });
    });
}
exports.getNewOfflinePosts = getNewOfflinePosts;
//# sourceMappingURL=user_controller.js.map