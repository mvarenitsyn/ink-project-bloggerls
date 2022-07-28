import bcrypt from 'bcrypt'

export const userService = {

    hashPassword: (password:string) => {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    },

    compareHashedPassword: async (password: string, hash:string) => {
        return await bcrypt.compare(password, hash)
    }

}