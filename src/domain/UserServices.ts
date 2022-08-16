import bcrypt from 'bcrypt'
import {requestLog} from "../db/db";

export const userServices = {

    hashPassword: (password:string) => {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    },

    compareHashedPassword: async (password: string, hash:string) => {
        return await bcrypt.compare(password, hash)
    },


    logRequest: (action:string, ip:string, time: Date) => {
        const newLog = {
            action: action,
            ip: ip,
            time: time
        }
        requestLog.push(newLog)
    },

    getRequests: (action:string, ip:string, time:Date) => {
        return requestLog.filter(request =>
            request.action === action && request.ip === ip && request.time > time
        )
    }

}

