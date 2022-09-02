import {ObjectId} from "mongodb";
import {userServices} from "./UserServices";
import {usersDBRepository} from "../repositories/UsersRepository";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"

export const usersRepo = {
    createUser: async (login: string, password: string, email:string) => {
        const hashedPassword = await userServices.hashPassword(password)
        const result = await usersDBRepository.createUser({
            _id: new ObjectId(),
            userData: {
                login: login,
                password: hashedPassword,
                email: email,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4().toString(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 5
                }),
                isConfirmed: false
            }
        })
        if(result) {
            return {
                "id": result.toString(),
                "login": login
            }
        } else return null
    },

    getUsers: async (pageNumber: number = 1, pageSize: number = 10) => {
        const userCount = await usersDBRepository.countUsers({})
        const pagesCount = Math.ceil(userCount/pageSize)
        const users = await usersDBRepository.getUsers(pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": users
        }
    },

    deleteUser: async (id: string) => {
        return await usersDBRepository.deleteUser(new ObjectId(id))
    },

    getUserById: async (id: string) => {
        try {
            return await usersDBRepository.getUser(new ObjectId(id))
        } catch (e) {
            return null
        }
    },

    getUserByLogin: async (login: string) => {
        return await usersDBRepository.getUser(login)
    },

    updateUserConfirmationCode: async (email:string) => {
        const code = uuidv4().toString()
        await usersDBRepository.updateConfirmationCode(email, code)
        return code
    }
}