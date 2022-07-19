import {Request, Response, Router} from "express";
import {body, validationResult} from 'express-validator'

import {bloggersRepository} from "../repositories/bloggers";

import {errorsAdapt} from "../utils";
import {isAuthorized, isValidBlogger} from "../middleware/general";
//

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


bloggersRouter.delete('/:id', isAuthorized, isValidBlogger, (req: Request, res: Response) => {
    bloggersRepository.deleteBloggerById(+req.params.id)
    res.status(204)
    res.end()
    return

})

bloggersRouter.post('/',isAuthorized,
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),
    (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({"errorMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            res.end()
            return
        }
        const newBlogger = bloggersRepository.createBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
        res.end()


    })

bloggersRouter.put('/:id', isAuthorized, isValidBlogger,
    body('youtubeUrl').exists().isLength({max: 100}).isURL(),
    body('name').trim().exists().isLength({min: 1, max: 15}).isString(),
    (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).send({"errorMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        res.end()
        return
    }
    bloggersRepository.updateBloggerById(+req.params.id, name, youtubeUrl)
    res.status(204)
    res.end()


})