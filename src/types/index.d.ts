import {userDBtype} from "../db/types";

declare global{
    declare namespace Express {
        export interface Request {
            currentUser: userDBtype | null
        }
    }
}