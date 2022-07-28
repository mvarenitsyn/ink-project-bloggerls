import {Request, Response, Router} from "express";

import {body, query, validationResult} from 'express-validator'
import {isAuthorized, isValidBlogger, isValidPost} from "../middleware/general";
import {errorsAdapt} from "../utils";
import {bloggersRepo} from "../domain/BloggersBusiness";
import {postsBusiness} from "../domain/PostsBusiness";

export const postsRouter = Router({})

postsRouter.get('/',
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        res.status(200).send(await postsBusiness.getPosts(pageNumber, pageSize))
        return
    })

postsRouter.get('/:id', isValidPost, async (req: Request, res: Response) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }

    res.status(200).send(await postsBusiness.getPostById(+req.params.id))
    return
})

postsRouter.post('/', isAuthorized,
    body('title').trim().notEmpty().isLength({max: 30}),
    body('shortDescription').trim().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isLength({max: 1000}),
    body('bloggerId').custom(async value => {
        if (!await bloggersRepo.getBloggerById(value)) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        res.status(201).send(await postsBusiness.createPost(title, shortDescription, content, bloggerId))
        return


    })

postsRouter.put('/:id', isAuthorized, isValidPost,
    body('title').trim().notEmpty().isLength({max: 30}),
    body('shortDescription').trim().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isLength({max: 1000}),
    body('bloggerId').custom(async value => {
        if (!await bloggersRepo.getBloggerById(value)) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        await postsBusiness.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
        res.sendStatus(204)
        res.end()


    })

postsRouter.delete('/:id', isAuthorized, isValidPost, async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    await postsBusiness.deletePost(+req.params.id)
    res.sendStatus(204)
    return

})