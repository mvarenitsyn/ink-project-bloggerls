import {Request} from "express";
import {NextFunction, Response} from "express/ts4.0";
import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {postsBusiness} from "../domain/PostsBusiness";
import {usersRepo} from "../domain/UsersBusiness";
import {authRepo} from "../domain/AuthBusiness";
import {ObjectId} from "mongodb";
import {LoggingRepository} from "../repositories/LoggingRepository";

import sub from "date-fns/sub"
import {userServices} from "../domain/UserServices";
import jwt, {Secret} from "jsonwebtoken";
import {usersDBRepository} from "../repositories/UsersRepository";

export const isValidBlogger = async (req: Request, res: Response, next: NextFunction) => {
    const bloggerId = req.params.blogId || req.params.id || null
    if (bloggerId && !await bloggersDBRepository.getBloggerById(bloggerId)) {
        res.sendStatus(404)
        return
    } else next()

    return
};

export const isValidUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id || null
    if (userId?.split('').length != 24) {
        res.sendStatus(404)
        return
    }
    if (userId && !await usersRepo.getUserById(userId)) {
        res.sendStatus(404)
        return
    } else {
        next()
        return
    }
};

export const isValidPost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId || req.params.id || null
    const exist = postId ? await postsBusiness.getPostById(postId) : null
    if (!exist) {
        res.status(404)
        res.end()
        return
    } else next()
};

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const authType: string | undefined = req.headers.authorization?.split(" ")[0].toString() || undefined
    const authPhrase: string = req.headers.authorization?.split(" ")[1].toString()

    //Basic auth
    if (authType === 'Basic') {
        const authorized = authPhrase === 'YWRtaW46cXdlcnR5'
        if (authorized) {
            next()
            return
        } else {
            res.sendStatus(401)
            return
        }

    }
    //JWT auth
    if (authType === 'Bearer') {
        const userId = authRepo.getUserIdByToken(authPhrase)
        if (userId) {
            req.currentUser = await usersRepo.getUserById(userId)
            next()
            return
        }

        res.sendStatus(401)
        return
    }
}

export const isValidRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const userId = refreshToken ? await authRepo.checkRefreshToken(refreshToken) : false
    if(userId) {
        req.currentUser = await usersRepo.getUserById(userId)
        next()
        return
    }
    res.sendStatus(401)
    return
}

export const isValidDeviceId = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken
    interface JwtPayload {
        id: string,
        deviceId: string,
        issuedAt: string,
    }
    const secret = process.env.JWT_SECRET
    const {id, deviceId} = jwt.verify(refreshToken, secret as Secret) as JwtPayload

    if(deviceId === req.params.id) {
        next()
        return
    }
    res.sendStatus(403)
    return
}

export const addUserCredentials = async (req: Request, res: Response, next: NextFunction) => {


    const authType: string | undefined = req.headers.authorization?.split(" ")[0].toString() || undefined
    const authPhrase: string | undefined = req.headers.authorization?.split(" ")[1].toString() || undefined

    if (authType === 'Bearer' && authPhrase) {
        const userId = authRepo.getUserIdByToken(authPhrase)
        if (userId) {
            req.currentUser = await usersRepo.getUserById(userId)
        }
    }
    next()
    return
}

export const isNotSpam = (action:string, time: number = 10, limit: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const logs = userServices.getRequests(action, req.ip, sub(new Date(), {seconds: time}))
        if(!logs || logs.length<limit) {
            userServices.logRequest(action, req.ip, new Date())
            next()
            return
        } else {
            res.sendStatus(429)
            return
        }
    }
}

export const isValidConfirmationCode = (code:string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const logs = await usersDBRepository.checkConfirmationCode(code)
        if (logs) {
            next()
            return
        } else {
            res.sendStatus(429)
            return
        }
    }
}
