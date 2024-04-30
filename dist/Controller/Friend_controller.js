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
exports.getFriendChat = exports.getnotification = exports.getMessages = exports.getSingle = exports.BlockFriend = exports.addFriend = exports.getAllFriend = void 0;
const User_model_1 = require("../db/Models/User_model");
const Message_model_1 = require("../db/Models/Message_model");
const getTime_1 = __importDefault(require("../services/getTime"));
const UnreadMessage_model_1 = require("../db/Models/UnreadMessage_model");
function getAllFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const users = yield User_model_1.User.aggregate([
            {
                $match: {
                    "Uid": user.Uid
                }
            },
            {
                $unwind: "$friendsList"
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
                "$project": {
                    "users": { "$arrayElemAt": ["$result", 0] }
                }
            }
        ]);
        let result = [];
        //users have friends 
        const MappingPromises = users.map((e) => __awaiter(this, void 0, void 0, function* () {
            const sender = yield UnreadMessage_model_1.UnreadMessage.findOne({ senderId: e.users._id, receiverId: user._id });
            return { senderUid: e.users.Uid, count: sender === null || sender === void 0 ? void 0 : sender.messages.length };
        }));
        const Mapping = yield Promise.all(MappingPromises); // array h uid k saath coun ka
        const user_map = new Map();
        for (let i = 0; i < Mapping.length; i++) {
            user_map.set(Mapping[i].senderUid, Mapping[i].count);
        }
        users.map((e) => {
            result.push({ name: e.users.name, avatar: e.users.avatar, Uid: e.users.Uid, isActive: e.users.isActive, lastSeen: e.users.lastSeen, count: 0 });
        });
        for (let i = 0; i < result.length; i++) {
            if (user_map.has(result[i].Uid)) {
                result[i].count = user_map.get(result[i].Uid) || 0;
            }
        }
        return res.status(200).json({ "user": result });
    });
}
exports.getAllFriend = getAllFriend;
function addFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiver_id } = req.body;
    });
}
exports.addFriend = addFriend;
function BlockFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //user k friends m jaake uska flag sirf change krde isblock ka
    });
}
exports.BlockFriend = BlockFriend;
function getSingle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const user = yield User_model_1.User.findOne({ Uid: req.body.Uid }).select("-password  -refreshToken -email -Posts  -groups -friendList");
        return res.status(200).json({ "user": user });
    });
}
exports.getSingle = getSingle;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Uid } = req.body; // Receiver id
        const r_user = yield User_model_1.User.findOne({ Uid: Uid }); // Receiver
        const user = req.user; // Client
        const messages_right = yield Message_model_1.Message.find({ Senderid: user._id, Receiverid: r_user === null || r_user === void 0 ? void 0 : r_user._id })
            .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
        const messages_left = yield Message_model_1.Message.find({ Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user === null || user === void 0 ? void 0 : user._id })
            .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
        const messages_right_with_pos = messages_right.map((e) => {
            return { message: e.message, type: e.type, time: e.time, pos: "receive" };
        });
        const messages_left_with_pos = messages_left.map((e) => {
            return { message: e.message, type: e.type, time: e.time, pos: "send" };
        });
        const mergedMessages = [...messages_left_with_pos, ...messages_right_with_pos];
        for (let i = 0; i < mergedMessages.length; i++) {
            for (let j = i + 1; j < mergedMessages.length; j++) {
                if (Calc(mergedMessages[i].time) < Calc(mergedMessages[j].time)) {
                    let temp = mergedMessages[i];
                    mergedMessages[i] = mergedMessages[j];
                    mergedMessages[j] = temp;
                }
            }
        }
        return res.status(200).json({ messages: mergedMessages });
    });
}
exports.getMessages = getMessages;
function Calc(dateString) {
    const currentDate = (0, getTime_1.default)(); // Get current date and time
    const [currentDatePart, currentTimePart] = currentDate.split(' '); // Split current date and time
    const [currentDay, currentMonth, currentYear] = currentDatePart.split('-').map(Number); // Parse current date
    const [currentHours, currentMinutes, currentSeconds] = currentTimePart.split(':').map(Number); // Parse current time
    const [datePart, timePart] = dateString.split(' '); // Split provided date and time
    const [day, month, year] = datePart.split('/').map(Number); // Parse provided date
    const [hours, minutes, seconds] = timePart.split(':').map(Number); // Parse provided time
    // Calculate the difference in seconds
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    const providedTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
    const currentDateTimeInSeconds = currentDay * 86400 + currentMonth * 2592000 + currentYear * 31104000 + currentTimeInSeconds;
    const providedDateTimeInSeconds = day * 86400 + month * 2592000 + year * 31104000 + providedTimeInSeconds;
    return currentDateTimeInSeconds - providedDateTimeInSeconds;
}
function getnotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const friends = yield User_model_1.User.aggregate([
            {
                $match: {
                    "Uid": user.Uid,
                },
            },
            {
                $unwind: "$friendsList",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friendsList.friend",
                    foreignField: "_id",
                    as: "result",
                },
            },
            {
                $project: {
                    "friend": { $arrayElemAt: ["$result", 0] },
                },
            },
        ]);
        const MappingPromises = friends.map((e) => __awaiter(this, void 0, void 0, function* () {
            const sender = yield UnreadMessage_model_1.UnreadMessage.findOne({ senderId: e.friend._id, receiverId: user._id });
            return { senderUid: e.friend.Uid, count: sender === null || sender === void 0 ? void 0 : sender.messages.length };
        }));
        const Mapping = yield Promise.all(MappingPromises);
        return res.status(200).json({ "notifications": Mapping });
    });
}
exports.getnotification = getnotification;
function getFriendChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Uid, time } = req.body; // receiver
        const user = req.user;
        const r_user = yield User_model_1.User.findOne({ Uid: Uid });
        if (time) {
            console.log("time h");
            let messages_time;
            messages_time = yield UnreadMessage_model_1.UnreadMessage.aggregate([
                {
                    $match: {
                        senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id,
                        receiverId: user._id,
                    }
                },
                {
                    $unwind: "$messages"
                },
                {
                    $match: {
                        "messages.time": { $lt: new Date(time) }
                    }
                }
            ]); // yaha ttak sirf  uss time  k upar k docs nikale
            console.log("more data line 267");
            console.log(messages_time);
            if (messages_time.length > 0) {
                console.log("line 270");
                let result = [];
                const length = messages_time.length;
                if (length && length > 10) {
                    messages_time.map((e) => {
                        result.push({ message: e.messages.message, type: e.messages.type, time: e.messages.time, pos: "receive" });
                    });
                    console.log("more than 10 docs h line 281");
                    const bw = messages_time.map((e) => {
                        return {
                            insertOne: {
                                document: { Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user._id, message: e.messages.message, type: e.messages.type, time: e.messages.time }
                            }
                        };
                    });
                    try {
                        const result_write = yield Message_model_1.Message.bulkWrite(bw);
                        console.log("Inserted successfully:", result_write);
                        yield UnreadMessage_model_1.UnreadMessage.updateOne({ senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id, receiverId: user._id }, {
                            $pull: {
                                messages: {
                                    $each: [],
                                    $slice: 10
                                }
                            }
                        });
                        // delete only 10
                        result.sort((a, b) => {
                            return Calc(b.time) - Calc(a.time);
                        });
                        return res.status(200).json({ "messages": result });
                    }
                    catch (err) {
                        console.error("Error inserting messages:", err);
                    }
                    console.log("length 10 s jyada unread ka" + result);
                }
                else if (length > 0) {
                    console.log("line 323");
                    let result = [];
                    messages_time.map((e) => {
                        result.push({ message: e.messages.message, type: e.messages.type, time: e.messages.time, pos: "send" });
                    }); // result m add 10-x messages
                    console.log("less than 10");
                    console.log("woh less than 10 unread msg h " + result);
                    const bw = messages_time.map((e) => {
                        return {
                            insertOne: {
                                document: { Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user._id, message: e.messages.message, type: e.messages.type, time: e.messages.time }
                            }
                        };
                    });
                    // hum with time k andar h. abb agar undread 5 h aur baaki k 5 message model s 
                    // chahiye toh hume msg model m $lt chaiye rhega last unseen ka time kaha tak hua tha waha s naaki starting k koi bhi 5
                    try {
                        const result = yield Message_model_1.Message.bulkWrite(bw);
                        console.log("Inserted successfully:", result);
                        yield UnreadMessage_model_1.UnreadMessage.deleteOne({ senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id, receiverId: user._id });
                    }
                    catch (err) {
                        console.error("Error inserting messages:", err);
                    }
                    const tofetch = 10 - messages_time.length;
                    // as documents are sorted by time result[0] should contain the least recent time of msg.
                    let leastRecentTime = result[0].time;
                    console.log("kis time s try kr rhe h fetch krne ka seen message m s" + leastRecentTime);
                    const messages_right = yield Message_model_1.Message.find({ Senderid: user._id, Receiverid: r_user === null || r_user === void 0 ? void 0 : r_user._id, time: { $lt: leastRecentTime } })
                        .sort({ "time": -1 }).limit(tofetch / 2).select("-Receiverid -Senderid");
                    const messages_left = yield Message_model_1.Message.find({ Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user === null || user === void 0 ? void 0 : user._id, time: { $lt: leastRecentTime } })
                        .sort({ "time": -1 }).limit(tofetch / 2).select("-Receiverid -Senderid");
                    const messages_right_with_pos = messages_right.map((e) => {
                        return { message: e.message, type: e.type, time: e.time, pos: "receive" };
                    });
                    const messages_left_with_pos = messages_left.map((e) => {
                        return { message: e.message, type: e.type, time: e.time, pos: "send" };
                    });
                    const mergedMessages = [...result, ...messages_left_with_pos, ...messages_right_with_pos];
                    mergedMessages.sort((a, b) => {
                        return Calc(b.time) - Calc(a.time);
                    });
                    console.log("after sort complete array looks like msg lessthan 10 aur time bhi h" + mergedMessages);
                    return res.status(200).json({ "messages": mergedMessages });
                }
            }
            else {
                console.log("line 384");
                const messages_right = yield Message_model_1.Message.find({ Senderid: user._id, Receiverid: r_user === null || r_user === void 0 ? void 0 : r_user._id, time: { $lt: time } })
                    .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
                const messages_left = yield Message_model_1.Message.find({ Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user === null || user === void 0 ? void 0 : user._id, time: { $lt: time } })
                    .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
                console.log();
                const messages_right_with_pos = messages_right.map((e) => {
                    return { message: e.message, type: e.type, time: e.time, pos: "receive" };
                });
                const messages_left_with_pos = messages_left.map((e) => {
                    return { message: e.message, type: e.type, time: e.time, pos: "send" };
                });
                const mergedMessages = [...messages_left_with_pos, ...messages_right_with_pos];
                mergedMessages.sort((a, b) => {
                    return Calc(b.time) - Calc(a.time);
                });
                console.log("no unseen message + time diya tha sab seen m s aarhe h");
                return res.status(200).json({ "messages": mergedMessages });
            }
        }
        else {
            let messages_notime;
            console.log("time nahi diya h kuch bhi");
            messages_notime = yield UnreadMessage_model_1.UnreadMessage.findOne({ senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id, receiverId: user._id }).select("messages");
            if (messages_notime) {
                let result = [];
                const length = messages_notime === null || messages_notime === void 0 ? void 0 : messages_notime.messages.length;
                if (length && length > 10) {
                    console.log("unseen 10 s jyada h notime " + messages_notime);
                    messages_notime.messages.map((e) => {
                        result.push({ message: e.message, type: e.type, time: e.time, pos: "receive" });
                    });
                    console.log("more than 10");
                    console.log(messages_notime);
                    const bw = messages_notime.messages.map((e) => {
                        return {
                            insertOne: {
                                document: { Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user._id, message: e.message, type: e.type, time: e.time }
                            }
                        };
                    });
                    try {
                        const result_write = yield Message_model_1.Message.bulkWrite(bw);
                        console.log("Inserted successfully:", result_write);
                        yield UnreadMessage_model_1.UnreadMessage.deleteOne({ senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id, receiverId: user._id });
                        result.sort((a, b) => {
                            return Calc(b.time) - Calc(a.time);
                        });
                        return res.status(200).json({ "messages": result });
                    }
                    catch (err) {
                        console.error("Error inserting messages:", err);
                    }
                }
                else if (length > 0) {
                    let result = [];
                    messages_notime.messages.map((e) => {
                        result.push({ message: e.message, type: e.type, time: e.time, pos: "send" });
                    }); // result m add 10-x messages
                    console.log("less than 10 with notime");
                    const bw = messages_notime.messages.map((e) => {
                        return {
                            insertOne: {
                                document: { Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user._id, message: e.message, type: e.type, time: e.time }
                            }
                        };
                    });
                    try {
                        const result_w = yield Message_model_1.Message.bulkWrite(bw);
                        console.log("Inserted successfully:", result_w);
                        yield UnreadMessage_model_1.UnreadMessage.deleteOne({ senderId: r_user === null || r_user === void 0 ? void 0 : r_user._id, receiverId: user._id });
                    }
                    catch (err) {
                        console.error("Error inserting messages:", err);
                    }
                    const tofetch = 10 - messages_notime.messages.length;
                    const leastfrequentmsg = result[0].time;
                    const messages_right = yield Message_model_1.Message.find({ Senderid: user._id, Receiverid: r_user === null || r_user === void 0 ? void 0 : r_user._id, time: { $lt: leastfrequentmsg } })
                        .sort({ "time": -1 }).limit(tofetch).select("-Receiverid -Senderid");
                    const messages_left = yield Message_model_1.Message.find({ Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user === null || user === void 0 ? void 0 : user._id, time: { $lt: leastfrequentmsg } })
                        .sort({ "time": -1 }).limit(tofetch).select("-Receiverid -Senderid");
                    const messages_right_with_pos = messages_right.map((e) => {
                        return { message: e.message, type: e.type, time: e.time, pos: "receive" };
                    });
                    const messages_left_with_pos = messages_left.map((e) => {
                        return { message: e.message, type: e.type, time: e.time, pos: "send" };
                    });
                    const mergedMessages = [...result, ...messages_left_with_pos, ...messages_right_with_pos];
                    mergedMessages.sort((a, b) => {
                        return Calc(b.time) - Calc(a.time);
                    });
                    console.log("total msg with someunread +some msg line 495 " + mergedMessages);
                    return res.status(200).json({ "messages": mergedMessages });
                }
            }
            else {
                const messages_right = yield Message_model_1.Message.find({ Senderid: user._id, Receiverid: r_user === null || r_user === void 0 ? void 0 : r_user._id })
                    .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
                const messages_left = yield Message_model_1.Message.find({ Senderid: r_user === null || r_user === void 0 ? void 0 : r_user._id, Receiverid: user === null || user === void 0 ? void 0 : user._id })
                    .sort({ "time": -1 }).limit(5).select("-Receiverid -Senderid");
                const messages_right_with_pos = messages_right.map((e) => {
                    return { message: e.message, type: e.type, time: e.time, pos: "receive" };
                });
                const messages_left_with_pos = messages_left.map((e) => {
                    return { message: e.message, type: e.type, time: e.time, pos: "send" };
                });
                const mergedMessages = [...messages_left_with_pos, ...messages_right_with_pos];
                mergedMessages.sort((a, b) => {
                    return Calc(b.time) - Calc(a.time);
                });
                console.log("no unseen no time 521");
                console.log(mergedMessages);
                return res.status(200).json({ "messages": mergedMessages });
            }
        }
        return res.status(200).json({ "message": 1 });
    });
}
exports.getFriendChat = getFriendChat;
//# sourceMappingURL=Friend_controller.js.map