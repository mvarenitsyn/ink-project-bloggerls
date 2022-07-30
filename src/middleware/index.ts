import {Request} from "express";
import {NextFunction, Response} from "express/ts4.0";
import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {postsBusiness} from "../domain/PostsBusiness";
import {usersRepo} from "../domain/UsersBusiness";
import {authRepo} from "../domain/AuthBusiness";

export const isValidBlogger = async (req: Request, res: Response, next:NextFunction) => {
    const bloggerId = req.params.bloggerId || req.params.id ||  null
    if(bloggerId && !await bloggersDBRepository.getBloggerById(bloggerId)) {
        res.sendStatus(404)
        return
    } else next()
};

export const isValidUserId = async (req: Request, res: Response, next:NextFunction) => {
    const userId = req.params.id || null

    if(userId && !await usersRepo.getUserById(userId)) {
        res.status(404)
        res.end()
        return
    } else next()
};

export const isValidPost= (req: Request, res: Response, next:NextFunction) => {
    const postId = +req.params.postId || +req.params.id || null
    const exist = postId ? postsBusiness.getPostById(postId) : null
    if(!exist) {
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
        authorized && next()
        return
    }
    //JWT auth
    if (authType === 'Bearer') {
        const userId = authRepo.getUserIdByToken(authPhrase)

        if(userId) {
            const user = await usersRepo.getUserById(userId)
            req.currentUser = user
            next()
            return
        }

    res.sendStatus(401)
    return
}}