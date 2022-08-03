import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})
export const MailerRepository = {
    sendEmail: async (to: string, message: string) => {
        try {
            const [fromName, email, subject] = ['VarDev', 'm.varenitsyn@gmail.com', 'Registration confirmation']
            const result = await transport.sendMail({
                from: `${fromName} <${email}>`,
                to: to,
                subject: subject,
                text: message
            })
            return (result.response).split(' ')[0]
        } catch (e) {
            console.log(e)
        }
    }
}