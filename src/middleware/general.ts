import {Request} from "express";
import {NextFunction, Response} from "express/ts4.0";
import { body, CustomValidator } from 'express-validator';
import {bloggersDB, postsDB} from "../db/db";
import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {postsBusiness} from "../domain/PostsBusiness";

export const isValidBlogger = async (req: Request, res: Response, next:NextFunction) => {
    const bloggerId = +req.params.id ||  null
    if(bloggerId && !await bloggersDBRepository.getBloggerById(bloggerId)) {
        res.status(404)
        res.end()
        return
    } else next()
};

export const isValidPost = async (req: Request, res: Response, next:NextFunction) => {
    const postId = +req.params.id || null

    if(postId && !await postsBusiness.getPostById(postId)) {
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
    const authorized:boolean = req.headers.authorization?.split(" ")[1].toString() === 'YWRtaW46cXdlcnR5'
    const authType:string = req.headers.authorization?.split(" ")[0].toString() || 'no auth'
    if (req.headers.authorization && authType==='Basic' && authorized) {
        next()
    }
    else {
        res.status(401)
        res.end()
        return

    }
}