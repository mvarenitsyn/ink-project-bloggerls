import {Response, Request, Router} from "express";
import {usersRepo} from "../domain/UsersBusiness";
import {authRepo} from "../domain/AuthBusiness";
import {body, validationResult} from "express-validator";
import {errorsAdapt} from "../utils";
import {isAuthorized} from "../middleware/general";

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

authRoutes.get('/login', isAuthorized, (req:Request, res:Response) => {
    res.sendStatus(200)
})