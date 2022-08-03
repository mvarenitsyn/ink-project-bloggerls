import bcrypt from 'bcrypt'

export const userServices = {

    hashPassword: (password:string) => {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    },

    compareHashedPassword: async (password: string, hash:string) => {
        return await bcrypt.compare(password, hash)
    },

    checkRequestsAmount: async(action:string, ip: string, countLimit: number, timeLimit: number) => {

    },

    logRequest: async (action:string, ip:string) => {
        const requestLog = {
            action: action,
            ip: ip,
            time: new Date()
        }
    }

}

