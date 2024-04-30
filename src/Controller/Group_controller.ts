import { Request, Response } from "express";


// Controller for getting all groups
export async function getAllGroup(req:Request, res:Response) {
   
}

// Controller for creating a new group
export async function CreateGroup(req:Request, res:Response) {
    
}

// Controller for getting a single group
export async function getSingleGroup(req:Request, res:Response) {
  
}

// Controller for joining a group
export async function joinGroup(req:Request, res:Response) {
 
}

// Controller for leaving a group
export async function leaveGroup(req:Request, res:Response) {
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
}

// Controller for getting all users in a group
export async function GetAllUsers_Group(req:Request, res:Response) {
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
}
 
