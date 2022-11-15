import {ObjectId} from "mongodb";
import {userServices} from "./UserServices";
import {usersDBRepository} from "../repositories/UsersRepository";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"
import {MailService} from "./MailService";

export const usersRepo = {
    createUser: async (login: string, password: string, email:string) => {
        const hashedPassword = await userServices.hashPassword(password)
        const newUser = {
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
        }
        const result = await usersDBRepository.createUser(newUser)
        if(result) {
            return {
                "id": result.toString(),
                "login": login,
                "email": newUser.userData.email,
                "createdAt": newUser.userData.createdAt
            }
        } else return null
    },

    sendRecovery: async(email: string) => {
      try {
        if(await usersDBRepository.checkUserEmail(email)) {
          const code = usersRepo.updateUserConfirmationCode(email)
          const confirmEmail = await MailService.sendEmail(email,
              `https://ink-project-bloggerls.herokuapp.com/auth/password-recovery?recoveryCode=${code}`)
          if (confirmEmail === '250') {
              return '204'
          } else return undefined
      } else return undefined
      } catch (e) {
          return undefined
      }
    },

    setNewPassword: async(password: string, code: string) => {
       try{
           if(await usersDBRepository.checkConfirmationCode(code)) {
               const hashedPassword = await userServices.hashPassword(password)
               await usersDBRepository.updateUserPassword(code, hashedPassword)
               return true
           } else {
               return false
           }
       } catch (e) {
           return false
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