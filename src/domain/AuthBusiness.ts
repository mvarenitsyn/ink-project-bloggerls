import {usersRepo} from "./UsersBusiness";
import {userService} from "./user-service";
import 'dotenv/config'
import jwt, {Secret} from "jsonwebtoken"
const secret = process.env.JWT_SECRET

export const authRepo = {
    checkUserCredentials: async (login:string, password:string) => {
        const user = await usersRepo.getUserByLogin(login)
        if(user) {
            const hash = user?.password
            return {loggedIn: await userService.compareHashedPassword(password, hash), userId: user?._id.toString()}
        }
        return {loggedIn: false, userId: ''}
    },
    createJWT: (id:string) => {

        return jwt.sign({id: id}, secret as Secret, { expiresIn: '1h' })
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

}}