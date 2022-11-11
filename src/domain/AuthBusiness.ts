import {usersRepo} from "./UsersBusiness";
import {userServices} from "./UserServices";
import 'dotenv/config'
import jwt, {Secret} from "jsonwebtoken"
import {MailService} from "./MailService";
import {v4 as uuidv4} from "uuid"
import {refreshToken} from "../db/types";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import compareAsc from "date-fns/compareAsc";
import {tokensRepository} from "../repositories/TokensRepository";

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
        return jwt.sign({id: id}, secret as Secret, {expiresIn: '300s'})
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
                const confirmEmail = newUser && await MailService.sendEmail(newUser?.userData.email,
                    `https://ink-project-bloggerls.herokuapp.com/auth/registration-confirmation?code=${newUser?.emailConfirmation.confirmationCode}`)
                if (confirmEmail === '250') {
                    return '204'
                } else return undefined
            } else return undefined

        } catch (e) {
            return undefined
        }


    },

    createRefreshToken: async(userId: string, timeout:number = 120000, deviceName:string = 'None', ip:string = '') => {
        try {
            const now = new Date()
            const deviceId = uuidv4()
            const tokenId = jwt.sign({id: userId, deviceId: deviceId, issuedAt: now}, secret as Secret, {expiresIn: timeout})
            const newToken:refreshToken = {
                _id: new ObjectId(),
                token: tokenId,
                valid: true,
                deviceId: deviceId,
                issuedAt: now,
                deviceName: deviceName,
                validUntil: add(now, {
                    seconds: 20000
                }),
                user: userId,
                ip: ip
            }
            await tokensRepository.createToken(newToken)
            return tokenId
        } catch (e) {
            return null
        }

    },

    refreshToken: async(tokenId: string) => {
      try {
          interface JwtPayload {
              id: string,
              deviceId: string,
              issuedAt: string,
          }
          const {id, deviceId, issuedAt} = jwt.verify(tokenId, secret as Secret) as JwtPayload

          const token = await tokensRepository.getTokenDataByDevice(deviceId)


          if(id && token && token && token.validUntil > new Date() && token.valid && compareAsc(token!.issuedAt, new Date(issuedAt))===0) {
              const updatedTime = await tokensRepository.updateToken(deviceId)
              return jwt.sign({id: id, deviceId: deviceId, issuedAt: updatedTime}, secret as Secret, {expiresIn: 900000})
          } else {
              return false
          }

      } catch (e) {
          return false
      }
    },

    checkRefreshToken: async(tokenId: string) => {
        try {
            interface JwtPayload {
                id: string,
                deviceId: string,
                issuedAt: string,
            }
            const {id, deviceId} = jwt.verify(tokenId, secret as Secret) as JwtPayload
            const token = await tokensRepository.getTokenDataByDevice(deviceId)
            if(id && token && token && token.validUntil > new Date() && token.valid) {
                return id
            } else {
                return false
            }

        } catch (e) {
            return false
        }
    },

    deactivateToken: async (tokenId: string) => {
      try {
          return tokensRepository.deactivateToken(tokenId)
      } catch (e) {
          return false
      }
    },


   updateConfirmationCode: async (email: string) => {
       const code = await usersRepo.updateUserConfirmationCode(email)
       try {
           return await MailService.sendEmail(email, `https://ink-project-bloggerls.herokuapp.com/auth/registration-confirmation?code=${code}`)
       }
       catch (e) {
           throw e
       }
   }



}