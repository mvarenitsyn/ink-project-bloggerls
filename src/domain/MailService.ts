import {MailerRepository} from "../repositories/MailerRepository";

export const MailService = {
    sendEmail: async (to: string, message: string) => {
        return await MailerRepository.sendEmail(to, message)

    }
}