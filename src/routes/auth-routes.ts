import {Response, Request, Router} from "express";
import {authRepo} from "../domain/AuthBusiness";
import {body, validationResult} from "express-validator";
import {errorsAdapt} from "../utils";
import {isAuthorized, isNotSpam} from "../middleware";

export const authRoutes = Router({})

authRoutes.post('/login',
    body('login').exists().isString(),
    body('password').exists().isString(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        const {login, password} = req.body
        const {loggedIn, userId} = await authRepo.checkUserCredentials(login, password)
        if (loggedIn) {
            res.status(200).json({"token": authRepo.createJWT(userId)})
            return
        }
        res.sendStatus(401)
    })

authRoutes.post('/registration', isNotSpam('register', 10, 5),
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    body('email').normalizeEmail().isEmail(),
    async (req: Request, res: Response) => {
        const {login, email, password} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        const userCreated = await authRepo.userRegistration(login, password, email)
        if (userCreated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }

    })

authRoutes.get('/login', isAuthorized, (req: Request, res: Response) => {
    res.sendStatus(200)
})