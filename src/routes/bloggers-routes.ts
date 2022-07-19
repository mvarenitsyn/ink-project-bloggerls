import {NextFunction, Request, Response, Router} from "express";
import {param, body, validationResult} from 'express-validator'

import {bloggersRepository} from "../repositories/bloggers";
import {postsRepository} from "../repositories/posts";
import {errorsAdapt} from "../utils";
import {isAuthorized, isValidBlogger} from "../middleware/general";


export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: Request, res: Response) => {
    console.log(req.headers.authorization?.split(" ")[1])


    res.status(200).send(bloggersRepository.getBloggers())
    res.end()
})

bloggersRouter.get('/:id', isValidBlogger, (req: Request, res: Response) => {
    res.status(200).send(bloggersRepository.getBloggerById(+req.params.id))
    res.end()
    return


})


bloggersRouter.delete('/:id', isValidBlogger, (req: Request, res: Response) => {
    bloggersRepository.deleteBloggerById(+req.params.id)
    res.status(204)
    res.end()
    return

})

bloggersRouter.post('/',isAuthorized,
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({errorMessages: errorsAdapt(errors.array({onlyFirstError: true}))})
            res.end()
            return
        }
        const newBlogger = bloggersRepository.createBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
        res.end()


    })

bloggersRouter.put('/:id', isValidBlogger,
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errorMessages: errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }
    bloggersRepository.updateBloggerById(+req.params.id, name, youtubeUrl)
    res.status(204)
    res.end()


})