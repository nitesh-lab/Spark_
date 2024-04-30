"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    Senderid: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    Receiverid: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    type: { type: String },
    time: { type: String },
});
exports.Message = mongoose_1.default.model("Message", MessageSchema);
//# sourceMappingURL=Message_model.js.map