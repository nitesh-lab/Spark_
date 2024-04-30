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
exports.ConnectSocket = exports.emitter = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../db/Models/User_model");
const UnreadMessage_model_1 = require("../db/Models/UnreadMessage_model");
const events_1 = require("events");
const Message_model_1 = require("../db/Models/Message_model");
exports.emitter = new events_1.EventEmitter();
function ConnectSocket(server) {
    const users = new Map(); // maps user token with socket id
    const sockets = new Map(); // maps users id with socket instance
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "https://spark-9j9e.onrender.com",
            credentials: true,
        }
    });
    exports.emitter.on("newFriendRequest", ({ sender, receiver }) => __awaiter(this, void 0, void 0, function* () {
        //socket m jaise hi user aaye uska isactive true kr pahle.
        const user = yield User_model_1.User.findOne({ Uid: receiver });
        if (user && user.isActive && user.isActive === true) {
            //await FriendRequest.deleteOne({_id:doc});
            //sender ki details nikalo
            const sender_user = yield User_model_1.User.findOne({ Uid: sender });
            io.emit("newFriendRequest", { name: sender_user === null || sender_user === void 0 ? void 0 : sender_user.name, avatar: sender_user === null || sender_user === void 0 ? void 0 : sender_user.avatar, Uid: sender_user === null || sender_user === void 0 ? void 0 : sender_user.Uid });
            return;
        }
        else {
            return;
        }
    }));
    io.on("connection", (socket) => {
        let user_token = (socket.handshake.headers.authorization);
        console.log("user connect line 59 socket");
        console.log("token");
        console.log(user_token);
        if (user_token && typeof (user_token) === "string") {
            user_token = user_token.split(" ")[1];
            users.set(socket.id, user_token); // token m  s bearer hatake user map m socketid k saath token daala.    
            console.log("yeh sockeet cnonnect hua");
            console.log(socket.id);
            // know start fetching the _id of that user of db and then store it with the instance of that socket.
            const curr_user = jsonwebtoken_1.default.verify(user_token, process.env.ACCESS_TOKEN_SECRET);
            sockets.set(curr_user._id, socket); // succesfully mapped the socket instance with users id
        }
        socket.on("UNFOLLOW", ({ receiverid }) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("socket coming 72");
            const user = yield User_model_1.User.findOne({ Uid: receiverid }); // receiver
            const sender_user = users.get(socket.id); // get token of user
            console.log("yeh unfollow bhej rha h");
            console.log(socket.id);
            console.log("recevierid");
            console.log(receiverid);
            console.log("sender_user");
            console.log(sender_user);
            let flag = false;
            if (sender_user && user) {
                console.log("79");
                const curr_user = jsonwebtoken_1.default.verify(sender_user, process.env.ACCESS_TOKEN_SECRET);
                // user?.friendsList?.includes({friend:isBlock:false}) 
                (_a = user.friendsList) === null || _a === void 0 ? void 0 : _a.map((e) => {
                    if (e.friend.toString() === curr_user._id) {
                        flag = true;
                    }
                    return;
                });
                yield User_model_1.User.updateOne({ _id: curr_user._id }, {
                    $pull: { friendsList: { "friend": user === null || user === void 0 ? void 0 : user._id } }
                });
                yield User_model_1.User.updateOne({ _id: user && user._id }, {
                    $pull: { friendsList: { "friend": curr_user._id } }
                });
                console.log("101");
                console.log(flag);
                socket.emit("unfollow", flag);
            }
            else {
                console.log("line 92");
                return;
            }
        }));
        // when new user join everybody gets to know.
        socket.on("joinRoom", (obj) => __awaiter(this, void 0, void 0, function* () {
            const { name } = obj;
            socket.join(name); // try to pass unique name from frontend.
            const curr_user_token = users.get(socket.id) || "";
            const user = (jsonwebtoken_1.default.verify(curr_user_token, process.env.ACCESS_TOKEN_SECRET));
            io.to(name).emit("newuserJoined", { name: user.name, avatar: user.avatar });
        }));
        // msg sent in group or individual
        socket.on("newTextMessage", (obj) => __awaiter(this, void 0, void 0, function* () {
            const curr_user_token = users.get(socket.id) || ""; // hash map s user ka token leerhe h
            const sender_user = (jsonwebtoken_1.default.verify(curr_user_token, process.env.ACCESS_TOKEN_SECRET)); // client or sender
            // sender ki _id nikali
            const { input, Uid } = obj;
            const receiver_user = yield User_model_1.User.findOne({ Uid: Uid }).select("_id isActive"); // recevier ki id nikali
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString("en-GB");
            const formattedTime = currentDate.toLocaleTimeString("en-GB", { hour12: false });
            const formattedDateTime = `${formattedDate} ${formattedTime}`;
            if (!(receiver_user === null || receiver_user === void 0 ? void 0 : receiver_user.isActive)) {
                // check if receiver not active.
                yield UnreadMessage_model_1.UnreadMessage.updateOne({
                    senderId: sender_user._id,
                    receiverId: receiver_user === null || receiver_user === void 0 ? void 0 : receiver_user._id,
                }, {
                    $addToSet: { "messages": { message: input, type: "text", time: formattedDateTime } }
                }, { upsert: true });
                return;
            }
            else {
                const msg = yield Message_model_1.Message.create({
                    Senderid: sender_user._id,
                    Receiverid: receiver_user._id, // else message model m daaldo
                    message: input,
                    type: "text",
                    time: formattedDateTime,
                });
                let socket_instance;
                if (sockets.has(receiver_user._id.toString())) { // ek specific user ko send krna h msg sender ko hashmap m find krna padega ki kon h
                    console.log("sockets map m ache s add hogya tha"); // sockets map m  socket ki instance value h aur key m user ki id h
                    socket_instance = sockets.get(receiver_user._id.toString());
                    return socket_instance.emit("newTextMessage", msg); // getting new msg as newTextMessage
                }
            }
            return;
        }));
        socket.on("UserCameOnline", (uid) => __awaiter(this, void 0, void 0, function* () {
            yield User_model_1.User.updateOne({ Uid: uid }, {
                $set: { "isActive": true }
            });
        }));
        socket.on("leaveGroup", (m) => __awaiter(this, void 0, void 0, function* () {
            //socket.leave("string") room to leave.
            //find group joined by this user  remove his entry from db and notify all users in the channel with name and avaatr..
        }));
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            const token = users.get(socket.id);
            if (token) {
                const user = (jsonwebtoken_1.default.verify(token, (process.env.ACCESS_TOKEN_SECRET)));
                if (typeof user !== "string" && "Uid" in user) {
                    const userData = user;
                    yield User_model_1.User.updateOne({ Uid: userData.Uid }, {
                        $set: { "isActive": false },
                    });
                }
            }
            users.delete(socket.id);
            console.log("user disconnect");
        }));
        socket.on("newLike", ({ _id }) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            // u will get post ki id hna  in user we do have posts id
            // we finded the user 
            const user = yield User_model_1.User.findOne({ Posts: _id }).select("friendsList");
            const users = (_b = user === null || user === void 0 ? void 0 : user.friendsList) === null || _b === void 0 ? void 0 : _b.filter((e) => {
                return sockets.has(e.friend.toString());
            });
            if (users) {
                users.map((e) => {
                    var _a;
                    (_a = sockets.get(e.friend.toString())) === null || _a === void 0 ? void 0 : _a.join("like");
                });
            }
            io.to("like").emit("newLike", { post_id: _id });
        }));
        socket.on("newComment", ({ _id }) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const user = yield User_model_1.User.findOne({ Posts: _id }).select("friendsList");
            const users = (_c = user === null || user === void 0 ? void 0 : user.friendsList) === null || _c === void 0 ? void 0 : _c.filter((e) => {
                return sockets.has(e.friend.toString());
            });
            if (users) {
                users.map((e) => {
                    var _a;
                    (_a = sockets.get(e.friend.toString())) === null || _a === void 0 ? void 0 : _a.join("comment");
                });
            }
            io.to("comment").emit("newComment", { post_id: _id });
        }));
        socket.on("audiomsg", (obj) => __awaiter(this, void 0, void 0, function* () {
            console.log("req aarhi  h audio msg k lie");
            const { Uid, url } = obj;
            console.log("url=" + url);
            const r_user = yield User_model_1.User.findOne({ Uid }); // receiver milgaya msg ka.
            const curr_user_token = users.get(socket.id) || ""; // socket id s sender find kiya.
            const sender_user = (jsonwebtoken_1.default.verify(curr_user_token, process.env.ACCESS_TOKEN_SECRET));
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString("en-GB");
            const formattedTime = currentDate.toLocaleTimeString("en-GB", { hour12: false });
            const formattedDateTime = `${formattedDate} ${formattedTime}`;
            if (r_user && "_id" in r_user) {
                console.log("r_user k paas id h");
                if (!r_user.isActive) {
                    yield UnreadMessage_model_1.UnreadMessage.updateOne({
                        senderId: sender_user._id,
                        receiverId: r_user._id,
                    }, { $addToSet: { "messages": { message: url, "type": "audio", "time": formattedDateTime } } }, { upsert: true });
                    return;
                }
                else {
                    const msg = yield Message_model_1.Message.create({
                        Senderid: sender_user._id,
                        Receiverid: r_user._id,
                        message: url,
                        type: "audio",
                        time: formattedDateTime,
                    });
                    let socket_instance;
                    if (sockets.has(r_user._id.toString())) {
                        console.log("sockets map m ache s add hogya tha");
                        socket_instance = sockets.get(r_user._id.toString());
                        return socket_instance.emit("audiomsg", msg);
                    }
                    else {
                        console.log("sockts map m ache s add nahi hua tha");
                        return;
                    }
                }
            }
            return;
        }));
    });
}
exports.ConnectSocket = ConnectSocket;
//# sourceMappingURL=ConnectSocket.js.map