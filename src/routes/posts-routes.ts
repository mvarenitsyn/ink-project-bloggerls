import {Request, Response, Router} from "express";

import {param, body, query, validationResult} from 'express-validator'
import {addUserCredentials, isAuthorized, isValidPost} from "../middleware";
import {errorsAdapt, validateSeq} from "../utils";
import {bloggersRepo} from "../domain/BloggersBusiness";
import {postsBusiness} from "../domain/PostsBusiness";
import {commentsRepo} from "../domain/CommentsBusiness";
import {authRepo} from "../domain/AuthBusiness";


export const postsRouter = Router({})

postsRouter.get('/', addUserCredentials,
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

        res.status(200).send(await postsBusiness.getPosts(pageNumber, pageSize, req.currentUser || null))
        return
    })

postsRouter.get('/:id', isValidPost, addUserCredentials, async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }

    res.status(200).send(await postsBusiness.getPostById(req.params.id, req.currentUser || null))
    return
})

postsRouter.get('/:postId/comments', isValidPost, addUserCredentials,
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

        res.status(200).send(await commentsRepo.getCommentsByPostId(req.params.postId, pageNumber, pageSize, req.currentUser))
        return
    })

postsRouter.post('/', isAuthorized,
    body('title').trim().notEmpty().isLength({max: 30}),
    body('shortDescription').trim().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(async value => {
        if (!await bloggersRepo.getBloggerById(value)) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, blogId} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        res.status(201).send(await postsBusiness.createPost(title, shortDescription, content, blogId))
        return


    })

postsRouter.post('/:postId/comments', isAuthorized, validateSeq([
        param('postId').isInt(),
        body('content').trim().notEmpty().isLength({max: 300, min: 20})
    ]), isValidPost,
    async (req: Request, res: Response) => {
        const {content} = req.body
        const errors = validationResult(req)


        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        if (req.currentUser) {
            res.status(201).send(await commentsRepo.createComment(req.params.postId, content, req.currentUser))
            return
        }
        res.sendStatus(401)
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

        await postsBusiness.updatePostById(req.params.id, title, shortDescription, content, bloggerId)
        res.sendStatus(204)
        res.end()
    })


postsRouter.put('/:postId/like-status', isAuthorized, isValidPost, body('likeStatus').isIn(['Like', 'Dislike', 'None']),
    async (req: Request, res: Response) => {
        const {likeStatus} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        if (req.currentUser) {
            await postsBusiness.setLike(req.params.postId, likeStatus, req.currentUser)
            res.sendStatus(204)
            return
        }
        res.sendStatus(401)
        return
    })


postsRouter.delete('/:id', isAuthorized, isValidPost, async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    await postsBusiness.deletePost(req.params.id)
    res.sendStatus(204)
    return

})


