import {Request, Response, Router} from "express";
import {body, validationResult} from 'express-validator'
import {errorsAdapt} from "../utils";
import {usersRepo} from "../domain/UsersBusiness";
import {isAuthorized, isValidUserId} from "../middleware/general";

export const usersRouter = Router({})

usersRouter.get('/', async (req:Request, res:Response) => {
    res.status(200).json(await usersRepo.getUsers(1,10))
})

usersRouter.post('/',
    isAuthorized,
    body('login').isLength({min:3, max:10}),
    body('password').isLength({min:6, max:20}),
    async (req:Request, res:Response) => {
    const {login, password} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    res.status(201).json(await usersRepo.createUser(login, password))
})

usersRouter.delete('/:id', isAuthorized, isValidUserId, async (req:Request, res:Response) => {
    await usersRepo.deleteUser(req.params.id)
    res.sendStatus(204)
})