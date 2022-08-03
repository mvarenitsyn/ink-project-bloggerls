import {usersRepo} from "./UsersBusiness";
import {userServices} from "./UserServices";
import 'dotenv/config'
import jwt, {Secret} from "jsonwebtoken"
import {MailService} from "./MailService";

const secret = process.env.JWT_SECRET

export const authRepo = {
    checkUserCredentials: async (login: string, password: string) => {
        const user = await usersRepo.getUserByLogin(login)
        if (user) {
            const hash = user?.userData.password
            return {loggedIn: await userServices.compareHashedPassword(password, hash), userId: user?._id.toString()}
        }
        return {loggedIn: false, userId: ''}
    },
    createJWT: (id: string) => {
        return jwt.sign({id: id}, secret as Secret, {expiresIn: '1h'})
    },
    getUserIdByToken: (token: string) => {
        interface JwtPayload {
            id: string
        }

        try {
            const {id} = jwt.verify(token, secret as Secret) as JwtPayload
            return id
        } catch (e) {
            return null
        }

    },
    userRegistration: async (login: string, password: string, email: string) => {
        try {
            const isCreated = await usersRepo.createUser(login, password, email)
            if (isCreated) {//check if user was created
                const newUser = await usersRepo.getUserById(isCreated.id)
                const confirmEmail = newUser && await MailService.sendEmail(newUser?.userData.email, newUser?.emailConfirmation.confirmationCode)
                if (confirmEmail === '250') {
                    return '204'
                } else return undefined
            } else return undefined
        } catch (e) {
            return undefined
        }


    }


}