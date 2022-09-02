import {Response, Request, Router} from "express";
import {authRepo} from "../domain/AuthBusiness";
import {body, cookie, validationResult} from "express-validator";
import {errorsAdapt} from "../utils";
import {isAuthorized, isNotSpam, isValidRefreshToken} from "../middleware";
import {usersDBRepository} from "../repositories/UsersRepository";


export const authRoutes = Router({})

authRoutes.post('/login', isNotSpam('login', 10, 5),
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
            const refreshToken = await authRepo.createRefreshToken(userId)
            res.cookie('refreshToken', refreshToken,
                {
                    maxAge: 20000,
                    httpOnly: true,
                    secure: true
                }
                )
            .status(200)
            .json({"accessToken": authRepo.createJWT(userId)})

            return
        }
        res.sendStatus(401)
    })

authRoutes.post('/registration', isNotSpam('register', 10, 5),
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    body('email').normalizeEmail().isEmail(),
    body('email').custom(async value => {
        if (await usersDBRepository.checkUserEmail(value)) {
            return Promise.reject();
        }
    }),
    body('login').custom(async value => {
        if (await usersDBRepository.getUser(value)) {
            return Promise.reject();
        }
    }),
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

authRoutes.post('/registration-confirmation', isNotSpam('confirm', 10, 5), body('code').custom(async value => {
    const user = await usersDBRepository.checkConfirmationCode(value)
    if (!user || user.emailConfirmation.isConfirmed) {
        return Promise.reject();
    }
}), async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    await usersDBRepository.confirmUser(req.body.code)
    res.sendStatus(204)
})

authRoutes.post('/registration-email-resending', isNotSpam('resend', 10, 5), body('email').normalizeEmail().isEmail(), body('email').custom(async value => {
    const user = await usersDBRepository.checkUserEmail(value)
    if (user===null || (user && user.emailConfirmation.isConfirmed)) {
        return Promise.reject();
    }
}), async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }
    await authRepo.updateConfirmationCode(req.body.email)
    res.sendStatus(204)
})

authRoutes.post('/refresh-token', isValidRefreshToken,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!._id.toString()
        const refreshToken = await authRepo.createRefreshToken(userId)
        res.cookie('refreshToken', refreshToken,
            {
                maxAge: 20000,
                httpOnly: true,
                secure: true
            }
        )
            .status(200)
            .json({"accessToken": authRepo.createJWT(userId)})

        return

})

authRoutes.post('/logout', isValidRefreshToken,
    async (req: Request, res: Response) => {
        await authRepo.deactivateToken(req.cookies.refreshToken)
        res.sendStatus(204)
        return

    })

authRoutes.get('/me', isAuthorized,
    (req: Request, res: Response) => {
    const user = req.currentUser
    res.status(200).json({
        "email": user?.userData.email,
        "login": user?.userData.login,
        "userId": user?._id
    })
})