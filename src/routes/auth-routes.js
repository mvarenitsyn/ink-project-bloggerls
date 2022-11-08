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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthBusiness_1 = require("../domain/AuthBusiness");
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
const UsersRepository_1 = require("../repositories/UsersRepository");
exports.authRoutes = (0, express_1.Router)({});
exports.authRoutes.post('/login', (0, middleware_1.isNotSpam)('login', 10, 5), (0, express_validator_1.body)('login').exists().isString(), (0, express_validator_1.body)('password').exists().isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    const { login, password } = req.body;
    const { loggedIn, userId } = yield AuthBusiness_1.authRepo.checkUserCredentials(login, password);
    if (loggedIn) {
        const refreshToken = yield AuthBusiness_1.authRepo.createRefreshToken(userId);
        res.cookie('refreshToken', refreshToken, {
            maxAge: 90000,
            httpOnly: true,
            secure: true
        })
            .status(200)
            .json({ "accessToken": AuthBusiness_1.authRepo.createJWT(userId) });
        return;
    }
    res.sendStatus(401);
}));
exports.authRoutes.post('/registration', (0, middleware_1.isNotSpam)('register', 10, 5), (0, express_validator_1.body)('login').isLength({ min: 3, max: 10 }), (0, express_validator_1.body)('password').isLength({ min: 6, max: 20 }), (0, express_validator_1.body)('email').normalizeEmail().isEmail(), (0, express_validator_1.body)('email').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield UsersRepository_1.usersDBRepository.checkUserEmail(value)) {
        return Promise.reject();
    }
})), (0, express_validator_1.body)('login').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield UsersRepository_1.usersDBRepository.getUser(value)) {
        return Promise.reject();
    }
})), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    const userCreated = yield AuthBusiness_1.authRepo.userRegistration(login, password, email);
    if (userCreated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRoutes.post('/registration-confirmation', (0, middleware_1.isNotSpam)('confirm', 10, 5), (0, express_validator_1.body)('code').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UsersRepository_1.usersDBRepository.checkConfirmationCode(value);
    if (!user || user.emailConfirmation.isConfirmed) {
        return Promise.reject();
    }
})), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    yield UsersRepository_1.usersDBRepository.confirmUser(req.body.code);
    res.sendStatus(204);
}));
exports.authRoutes.post('/registration-email-resending', (0, middleware_1.isNotSpam)('resend', 10, 5), (0, express_validator_1.body)('email').normalizeEmail().isEmail(), (0, express_validator_1.body)('email').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UsersRepository_1.usersDBRepository.checkUserEmail(value);
    if (user === null || (user && user.emailConfirmation.isConfirmed)) {
        return Promise.reject();
    }
})), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    yield AuthBusiness_1.authRepo.updateConfirmationCode(req.body.email);
    res.sendStatus(204);
}));
exports.authRoutes.post('/refresh-token', middleware_1.isValidRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.currentUser._id.toString();
    const refreshToken = yield AuthBusiness_1.authRepo.createRefreshToken(userId);
    res.cookie('refreshToken', refreshToken, {
        maxAge: 90000,
        httpOnly: true,
        secure: true
    })
        .status(200)
        .json({ "accessToken": AuthBusiness_1.authRepo.createJWT(userId) });
    return;
}));
exports.authRoutes.post('/logout', middleware_1.isValidRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield AuthBusiness_1.authRepo.deactivateToken(req.cookies.refreshToken);
    res.sendStatus(204);
    return;
}));
exports.authRoutes.get('/me', middleware_1.isAuthorized, (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
        "email": user === null || user === void 0 ? void 0 : user.userData.email,
        "login": user === null || user === void 0 ? void 0 : user.userData.login,
        "userId": user === null || user === void 0 ? void 0 : user._id
    });
});
