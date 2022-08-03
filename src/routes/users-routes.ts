import {Request, Response, Router} from "express";
import {body, query, validationResult} from 'express-validator'
import {errorsAdapt} from "../utils";
import {usersRepo} from "../domain/UsersBusiness";
import {isAuthorized, isValidUserId} from "../middleware";

export const usersRouter = Router({})

usersRouter.get('/', query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined
        res.status(200).json(await usersRepo.getUsers(pageNumber,pageSize))
})

usersRouter.post('/',
    isAuthorized,
    body('login').isLength({min:3, max:10}),
    body('password').isLength({min:6, max:20}),
    body('email').normalizeEmail().isEmail(),
    async (req:Request, res:Response) => {
    const {login, email, password} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    res.status(201).json(await usersRepo.createUser(login, password, email))
})

usersRouter.delete('/:id', isAuthorized, isValidUserId, async (req:Request, res:Response) => {
    await usersRepo.deleteUser(req.params.id)
    res.sendStatus(204)
})