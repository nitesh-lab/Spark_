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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const user_routes_1 = require("./routes/user_routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const friend_routes_1 = require("./routes/friend_routes");
const post_routes_1 = require("./routes/post_routes");
const uploadCloudinary_1 = __importDefault(require("./services/uploadCloudinary"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use(express_1.default.urlencoded({ limit: '50mb' }));
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
exports.app.use((0, cookie_parser_1.default)(process.env.cookie_secret));
exports.app.use((0, express_session_1.default)({
    name: "spark",
    secret: (_a = process.env.Session_secret) !== null && _a !== void 0 ? _a : "",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        secure: false,
        httpOnly: false,
    }
}));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use("/api/user", user_routes_1.user_router);
exports.app.use("/api/friend", friend_routes_1.friend_router);
exports.app.use("/api/post", post_routes_1.post_router);
exports.app.get("/api/auth/google", passport_1.default.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "http://localhost:5173/login"
}));
exports.app.get('/success', (req, res) => {
    var _a, _b, _c, _d;
    const session = req.session;
    const accessToken = (_b = (_a = session === null || session === void 0 ? void 0 : session.passport) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.accessToken;
    const refreshToken = (_d = (_c = session === null || session === void 0 ? void 0 : session.passport) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.refreshToken;
    if (accessToken && refreshToken) {
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
    }
    res.redirect('http://localhost:5173');
});
exports.app.post("/api/cloud", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = (req.body);
    const result = yield (0, uploadCloudinary_1.default)(file);
    res.status(200).json({ "message": result ? result : "" });
}));
//# sourceMappingURL=app.js.map