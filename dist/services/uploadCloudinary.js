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
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARYNAME,
    api_key: process.env.CLOUDINARYKEY, // credentials were the issue
    api_secret: process.env.CLOUDINARYSECRET,
});
function uploadCloudinary(fileBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uploadData = yield cloudinary_1.v2.uploader.upload(fileBase64, {
                resource_type: "video",
                width: 400,
                height: 400,
                crop: "limit",
            });
            return uploadData.url;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    });
}
exports.default = uploadCloudinary;
//# sourceMappingURL=uploadCloudinary.js.map