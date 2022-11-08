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
exports.isNotSpam = exports.addUserCredentials = exports.isValidRefreshToken = exports.isAuthorized = exports.isValidPost = exports.isValidUserId = exports.isValidBlogger = void 0;
const BloggersRepository_1 = require("../repositories/BloggersRepository");
const PostsBusiness_1 = require("../domain/PostsBusiness");
const UsersBusiness_1 = require("../domain/UsersBusiness");
const AuthBusiness_1 = require("../domain/AuthBusiness");
const sub_1 = __importDefault(require("date-fns/sub"));
const UserServices_1 = require("../domain/UserServices");
const isValidBlogger = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggerId = req.params.bloggerId || req.params.id || null;
    if (bloggerId && !(yield BloggersRepository_1.bloggersDBRepository.getBloggerById(bloggerId))) {
        res.sendStatus(404);
        return;
    }
    else
        next();
    return;
});
exports.isValidBlogger = isValidBlogger;
const isValidUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id || null;
    if ((userId === null || userId === void 0 ? void 0 : userId.split('').length) != 24) {
        res.sendStatus(404);
        return;
    }
    if (userId && !(yield UsersBusiness_1.usersRepo.getUserById(userId))) {
        res.sendStatus(404);
        return;
    }
    else {
        next();
        return;
    }
});
exports.isValidUserId = isValidUserId;
const isValidPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId || req.params.id || null;
    const exist = postId ? yield PostsBusiness_1.postsBusiness.getPostById(postId) : null;
    if (!exist) {
        res.status(404);
        res.end();
        return;
    }
    else
        next();
});
exports.isValidPost = isValidPost;
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const authType = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[0].toString()) || undefined;
    const authPhrase = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1].toString();
    //Basic auth
    if (authType === 'Basic') {
        const authorized = authPhrase === 'YWRtaW46cXdlcnR5';
        if (authorized) {
            next();
            return;
        }
        else {
            res.sendStatus(401);
            return;
        }
    }
    //JWT auth
    if (authType === 'Bearer') {
        const userId = AuthBusiness_1.authRepo.getUserIdByToken(authPhrase);
        if (userId) {
            req.currentUser = yield UsersBusiness_1.usersRepo.getUserById(userId);
            next();
            return;
        }
        res.sendStatus(401);
        return;
    }
});
exports.isAuthorized = isAuthorized;
const isValidRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const userId = refreshToken ? yield AuthBusiness_1.authRepo.refreshToken(refreshToken) : false;
    if (userId) {
        req.currentUser = yield UsersBusiness_1.usersRepo.getUserById(userId);
        next();
        return;
    }
    res.sendStatus(401);
    return;
});
exports.isValidRefreshToken = isValidRefreshToken;
const addUserCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const authType = ((_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[0].toString()) || undefined;
    const authPhrase = ((_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1].toString()) || undefined;
    if (authType === 'Bearer' && authPhrase) {
        const userId = AuthBusiness_1.authRepo.getUserIdByToken(authPhrase);
        if (userId) {
            req.currentUser = yield UsersBusiness_1.usersRepo.getUserById(userId);
        }
    }
    next();
    return;
});
exports.addUserCredentials = addUserCredentials;
const isNotSpam = (action, time = 10, limit = 5) => {
    return (req, res, next) => {
        const logs = UserServices_1.userServices.getRequests(action, req.ip, (0, sub_1.default)(new Date(), { seconds: time }));
        if (!logs || logs.length < limit) {
            UserServices_1.userServices.logRequest(action, req.ip, new Date());
            next();
            return;
        }
        else {
            res.sendStatus(429);
            return;
        }
    };
};
exports.isNotSpam = isNotSpam;
