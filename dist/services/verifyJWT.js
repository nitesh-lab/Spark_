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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../db/Models/User_model");
function verifyJWT(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (!req.headers.authorization && !req.cookies.accessToken) {
            return res.status(401).json({ "message": "Authentication Token Required", "check": false });
        }
        if (req.headers.authorization) {
            token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
            if (token.length < 10) {
                return res.status(401).json({ "message": "unauthorized", "check": false });
            }
        }
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        const decodedtoken = (jsonwebtoken_1.default.verify(token ? token : "", process.env.ACCESS_TOKEN_SECRET));
        if ("_id" in decodedtoken) {
            const user = yield User_model_1.User.findById(decodedtoken._id).select("-password -refreshToken");
            if (!user) {
                return res.status(401).json({ "message": "No such user", "check": false });
            }
            req.user = user;
        }
        next();
    });
}
exports.default = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map