import {Request} from "express";
import {NextFunction, Response} from "express/ts4.0";
import { body, CustomValidator } from 'express-validator';
import {bloggersDB} from "../db/db";

export const isValidBlogger = (req: Request, res: Response, next:NextFunction) => {
    const bloggerId = +req.params.id || null

    if(!bloggersDB.find((item:any) => item.id === bloggerId)) {
        res.status(404)
        res.end()
        return
    } else next()
};

const blockedIPs = ['::2']

export const notBlocked = (req: Request, res: Response, next:NextFunction) => {
    if (blockedIPs.includes(req.ip)) {
        res.status(403)
        res.end()
        return
    }
    else next()
}

export const isAuthorized = (req: Request, res: Response, next:NextFunction) => {
    if (req.headers.authorization && req.headers.authorization?.split(" ")[1].toString() === 'YWRtaW46cXdlcnR5') {
        next()
    }
    else {
        res.status(403)
        res.end()
        return

    }
}