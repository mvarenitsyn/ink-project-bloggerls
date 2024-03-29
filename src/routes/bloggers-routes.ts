import {Request, Response, Router} from "express";
import {body, query, validationResult} from 'express-validator'


import {bloggersRepo} from "../domain/BloggersBusiness";
import {errorsAdapt} from "../utils";
import {addUserCredentials, isAuthorized, isValidBlogger} from "../middleware";

export const bloggersRouter = Router({})

bloggersRouter.get('/',
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}), async (req: Request, res: Response) => {
        const searchTerm = req.query.SearchNameTerm?.toString()
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        res.status(200).send(await bloggersRepo.getBloggers(searchTerm, pageNumber, pageSize))
        return
    })

bloggersRouter.get('/:id', isValidBlogger, async (req: Request, res: Response) => {
    res.status(200).send(await bloggersRepo.getBloggerById(req.params.id))
    return


})


bloggersRouter.delete('/:id', isAuthorized, isValidBlogger, async (req: Request, res: Response) => {

    await bloggersRepo.deleteBlogger(req.params.id)
    res.sendStatus(204)
    return

})

bloggersRouter.post('/', isAuthorized,
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),
    async (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        const createdBlogger = await bloggersRepo.createBlogger(name, youtubeUrl)
        res.status(201).send(createdBlogger)
        return

    })

bloggersRouter.put('/:id', isAuthorized, isValidBlogger,
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),

    async (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            res.end()
            return
        }
        await bloggersRepo.updateBloggerById(req.params.id, name, youtubeUrl)
        res.sendStatus(204)
        return

    })

bloggersRouter.get('/:bloggerId/posts', isValidBlogger, addUserCredentials,
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
        res.status(200).send(await bloggersRepo.getBloggerPosts(pageNumber, pageSize, req.params.bloggerId, req.currentUser || null))

        return
    })

bloggersRouter.post('/:bloggerId/posts', isAuthorized, isValidBlogger,
    body('title').trim().notEmpty().isLength({max: 30}),
    body('shortDescription').trim().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isLength({max: 1000}), async (req: Request, res: Response) => {
    const {title, shortDescription, content} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        res.status(201).send(await bloggersRepo.createBloggerPost(title, shortDescription, content, req.params.bloggerId, req.currentUser || null))

        return
    })

