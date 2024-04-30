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
exports.uploadFileToSupabaseBucket = void 0;
const createSupabaseclient_1 = require("./createSupabaseclient");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
function uploadFileToSupabaseBucket(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unique_name = (0, uuid_1.v4)();
            const img_data = fs_1.default.readFileSync(path);
            const { data, error } = yield createSupabaseclient_1.supabase.storage
                .from("Spark")
                .upload(`${unique_name}`, img_data);
            if (error) {
                console.error('Error uploading file:', error.message);
                return null;
            }
            else {
                return data;
            }
        }
        catch (error) {
            console.error('Error:', error);
            return null;
        }
    });
}
exports.uploadFileToSupabaseBucket = uploadFileToSupabaseBucket;
//# sourceMappingURL=UploadSupabase.js.map