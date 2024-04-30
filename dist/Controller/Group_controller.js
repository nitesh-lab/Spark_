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
exports.GetAllUsers_Group = exports.leaveGroup = exports.joinGroup = exports.getSingleGroup = exports.CreateGroup = exports.getAllGroup = void 0;
// Controller for getting all groups
function getAllGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.getAllGroup = getAllGroup;
// Controller for creating a new group
function CreateGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.CreateGroup = CreateGroup;
// Controller for getting a single group
function getSingleGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.getSingleGroup = getSingleGroup;
// Controller for joining a group
function joinGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.joinGroup = joinGroup;
// Controller for leaving a group
function leaveGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        //     // Retrieve data from request body
        //     const { gid, userId } = req.body;
        //     // Find group by ID
        //     const group = await GroupModel.findOne({ gid });
        //     if (!group) {
        //         return res.status(404).json({ message: "Group not found" });
        //     }
        //     // Remove user from group
        //     group.users = group.users.filter(user => user.user.toString() !== userId);
        //     await group.save();
        //     return res.json({ message: "User left the group successfully" });
        // } catch (error) {
        //     return res.status(500).json({ message: "Internal Server Error" });
        // }
    });
}
exports.leaveGroup = leaveGroup;
// Controller for getting all users in a group
function GetAllUsers_Group(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        //     // Retrieve group ID from request body
        //     const { gid } = req.body;
        //     // Find group by ID and populate users
        //     const group = await GroupModel.findOne({ gid }).populate("users.user");
        //     if (!group) {
        //         return res.status(404).json({ message: "Group not found" });
        //     }
        //     return res.json(group.users);
        // } catch (error) {
        //     return res.status(500).json({ message: "Internal Server Error" });
        // }
    });
}
exports.GetAllUsers_Group = GetAllUsers_Group;
//# sourceMappingURL=Group_controller.js.map