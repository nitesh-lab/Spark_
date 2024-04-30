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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_model_1 = require("../db/Models/User_model");
const uuid_1 = require("uuid");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.Google_id || '',
    clientSecret: process.env.Google_secret || '',
    callbackURL: 'https://spark-9j9e.onrender.com/api/auth/google'
}, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, email, picture } = profile._json;
        let user = yield User_model_1.User.findOne({ email });
        if (!user) {
            const id = (0, uuid_1.v4)();
            user = yield User_model_1.User.create({
                Uid: id,
                name: name || '',
                email: email || '',
                avatar: picture,
                password: '-1',
                lastSeen: new Date().toISOString(),
            });
        }
        if (user) {
            const accessToken = (_a = user.generateAccessToken) === null || _a === void 0 ? void 0 : _a.call(user);
            const refreshToken = (_b = user.generateSecretToken) === null || _b === void 0 ? void 0 : _b.call(user);
            if (accessToken && refreshToken) {
                cb(null, { accessToken, refreshToken });
            }
            else {
                throw new Error('Failed to generate tokens');
            }
        }
        else {
            throw new Error('User not found');
        }
    }
    catch (error) {
        cb(error, false);
    }
})));
// Serialize and deserialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
//# sourceMappingURL=passport.js.map