"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FriendRequestSchema = new mongoose_1.default.Schema({
    senderid: { type: mongoose_1.default.Schema.Types.ObjectId },
    receiverid: { type: mongoose_1.default.Schema.Types.ObjectId },
});
exports.FriendRequest = mongoose_1.default.model("FriendRequest", FriendRequestSchema);
//# sourceMappingURL=FriendRequest_model.js.map