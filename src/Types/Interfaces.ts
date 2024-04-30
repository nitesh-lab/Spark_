import { Session } from "express-session";

export interface custom_session extends Session{
    uid?: string;
    user_access?:string,
    user_refresh?:string,
    passport?:{
        user?:{
            accessToken:string,
            refreshToken:string,
        }
    }
}