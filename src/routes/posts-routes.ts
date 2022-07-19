import {NextFunction, Request, Response, Router} from "express";

import { postsRepository } from "../repositories/posts";
import { bloggersRepository } from "../repositories/bloggers";
import {body, validationResult} from 'express-validator'
import {isAuthorized, isValidBlogger, isValidPost} from "../middleware/general";
import {errorsAdapt} from "../utils";

export const postsRouter = Router({})
const errMess:any = {
    "errorsMessages": []
}
postsRouter.get('/', (req:Request, res:Response) => {
    res.status(200).send(postsRepository.getPosts())
    res.end()
})

postsRouter.get('/:id', isValidPost, (req:Request, res:Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }

    res.status(200).send(postsRepository.getPostById(+req.params.id))
    res.end()
})

postsRouter.post('/', isAuthorized,
    body('title').trim().notEmpty().isLength({max:30}),
    body('shortDescription').trim().notEmpty().isLength({max:100}),
    body('content').trim().notEmpty().isLength({max:1000}),
    body('bloggerId').isInt(),
    (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }
    const blogger = bloggersRepository.getBloggerById(bloggerId)
    if(blogger) {
        res.status(201).send(postsRepository.createPost(title, shortDescription, content, bloggerId,blogger.name))
        res.end()
        return
    }


})

postsRouter.put('/:id', isAuthorized, isValidPost,
    body('title').trim().notEmpty().isLength({max:30}),
    body('shortDescription').trim().notEmpty().isLength({max:100}),
    body('content').trim().notEmpty().isLength({max:1000}),
    body('bloggerId').isInt(),
    (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const blogger = bloggersRepository.getBloggerById(bloggerId)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }

    blogger && postsRepository.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
    res.status(204)
    res.end()


})

postsRouter.delete('/:id', isAuthorized, isValidPost, (req:Request, res:Response) => {
    const post = postsRepository.getPostById(+req.params.id)
    if(post) {
        postsRepository.deletePostById(+req.params.id)
        res.status(204)
        res.end()
        return
    } else {
        res.status(404)
        res.end()
        return
    }

})