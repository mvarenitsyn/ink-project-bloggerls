"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerRepository = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});
exports.MailerRepository = {
    sendEmail: (to, message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [fromName, email, subject] = ['VarDev', 'm.varenitsyn@gmail.com', 'Registration confirmation'];
            const result = yield transport.sendMail({
                from: `${fromName} <${email}>`,
                to: to,
                subject: subject,
                text: message
            });
            return (result.response).split(' ')[0];
        }
        catch (e) {
            console.log(e);
        }
    })
};
