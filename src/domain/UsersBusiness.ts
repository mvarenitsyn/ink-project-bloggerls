import {ObjectId} from "mongodb";
import {userService} from "./user-service";
import {usersDBRepository} from "../repositories/UsersRepository";

export const usersRepo = {
    createUser: async (login: string, password: string) => {
        const hashedPassword = await userService.hashPassword(password)
        const result = await usersDBRepository.createUser({
            "_id": new ObjectId(),
            "login": login,
            "password": hashedPassword
        })
        if(result.insertedId) {
            return {
                "id": result.insertedId.toString(),
                "login": login
            }
        }
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
        return await usersDBRepository.getUser(new ObjectId(id))
    },

    getUserByLogin: async (login: string) => {
        return await usersDBRepository.getUser(login)
    }
}