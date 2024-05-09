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
exports.server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const ConnectDB_1 = require("./db/ConnectDB");
require("./Passport_Setup/passport");
const http_1 = __importDefault(require("http"));
const ConnectSocket_1 = require("./services/ConnectSocket");
require("../dist/services/createSupabaseclient");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
exports.server = http_1.default.createServer(app_1.app);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, ConnectDB_1.ConnectDB)();
            (0, ConnectSocket_1.ConnectSocket)(exports.server);
        }
        catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }
        const port = 8000;
        exports.server.listen(process.env.PORT || port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    });
}
__dirname = path_1.default.resolve();
console.log("process.env.NODE_ENV");
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    app_1.app.use(express_1.default.static(path_1.default.join(__dirname, '/Spark/dist')));
    console.log("production m aagaye");
    app_1.app.get('*', (req, res) => {
        console.log("__dirname" + __dirname);
        res.sendFile(path_1.default.resolve(__dirname, 'Spark', 'dist', 'index.html'));
        const str = path_1.default.resolve(__dirname, 'Spark', 'dist', 'index.html');
    });
}
else {
    app_1.app.get('/', (req, res) => {
        console.log("production m nahi h 76");
        res.send('API is running....');
    });
}
console.log("line 85");
startServer();
//# sourceMappingURL=index.js.map