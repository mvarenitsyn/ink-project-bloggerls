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
exports.authRepo = void 0;
const UsersBusiness_1 = require("./UsersBusiness");
const UserServices_1 = require("./UserServices");
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MailService_1 = require("./MailService");
const mongodb_1 = require("mongodb");
const add_1 = __importDefault(require("date-fns/add"));
const TokensRepository_1 = require("../repositories/TokensRepository");
const secret = process.env.JWT_SECRET;
exports.authRepo = {
    checkUserCredentials: (login, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UsersBusiness_1.usersRepo.getUserByLogin(login);
        if (user) {
            const hash = user === null || user === void 0 ? void 0 : user.userData.password;
            return { loggedIn: yield UserServices_1.userServices.compareHashedPassword(password, hash), userId: user === null || user === void 0 ? void 0 : user._id.toString() };
        }
        return { loggedIn: false, userId: '' };
    }),
    createJWT: (id) => {
        return jsonwebtoken_1.default.sign({ id: id }, secret, { expiresIn: '50s' });
    },
    getUserIdByToken: (token) => {
        try {
            const { id } = jsonwebtoken_1.default.verify(token, secret);
            return id;
        }
        catch (e) {
            return null;
        }
    },
    userRegistration: (login, password, email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isCreated = yield UsersBusiness_1.usersRepo.createUser(login, password, email);
            if (isCreated) { //check if user was created
                const newUser = yield UsersBusiness_1.usersRepo.getUserById(isCreated.id);
                const confirmEmail = newUser && (yield MailService_1.MailService.sendEmail(newUser === null || newUser === void 0 ? void 0 : newUser.userData.email, `https://ink-project-bloggerls.herokuapp.com/auth/registration-confirmation?code=${newUser === null || newUser === void 0 ? void 0 : newUser.emailConfirmation.confirmationCode}`));
                if (confirmEmail === '250') {
                    return '204';
                }
                else
                    return undefined;
            }
            else
                return undefined;
        }
        catch (e) {
            return undefined;
        }
    }),
    createRefreshToken: (userId, timeout = 20000) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tokenId = jsonwebtoken_1.default.sign({ id: userId }, secret, { expiresIn: timeout });
            const newToken = {
                _id: new mongodb_1.ObjectId(),
                token: tokenId,
                valid: true,
                validUntil: (0, add_1.default)(new Date(), {
                    seconds: 20
                }),
                user: userId
            };
            yield TokensRepository_1.tokensRepository.createToken(newToken);
            return tokenId;
        }
        catch (e) {
            return null;
        }
    }),
    refreshToken: (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = jsonwebtoken_1.default.verify(tokenId, secret);
            const token = yield TokensRepository_1.tokensRepository.getTokenData(tokenId);
            if (id && token && token && token.validUntil > new Date() && token.valid) {
                yield TokensRepository_1.tokensRepository.deactivateToken(tokenId);
                return id;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }),
    deactivateToken: (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return TokensRepository_1.tokensRepository.deactivateToken(tokenId);
        }
        catch (e) {
            return false;
        }
    }),
    updateConfirmationCode: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const code = yield UsersBusiness_1.usersRepo.updateUserConfirmationCode(email);
        try {
            return yield MailService_1.MailService.sendEmail(email, `https://ink-project-bloggerls.herokuapp.com/auth/registration-confirmation?code=${code}`);
        }
        catch (e) {
            throw e;
        }
    })
};
