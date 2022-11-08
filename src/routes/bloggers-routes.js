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
exports.bloggersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const BloggersBusiness_1 = require("../domain/BloggersBusiness");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
exports.bloggersRouter = (0, express_1.Router)({});
exports.bloggersRouter.get('/', (0, express_validator_1.query)('PageNumber').isInt().optional({ checkFalsy: true }), (0, express_validator_1.query)('PageSize').isInt().optional({ checkFalsy: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const searchTerm = (_a = req.query.SearchNameTerm) === null || _a === void 0 ? void 0 : _a.toString();
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined;
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(200).send(yield BloggersBusiness_1.bloggersRepo.getBloggers(searchTerm, pageNumber, pageSize));
    return;
}));
exports.bloggersRouter.get('/:id', middleware_1.isValidBlogger, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield BloggersBusiness_1.bloggersRepo.getBloggerById(req.params.id));
    return;
}));
exports.bloggersRouter.delete('/:id', middleware_1.isAuthorized, middleware_1.isValidBlogger, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield BloggersBusiness_1.bloggersRepo.deleteBlogger(req.params.id);
    res.sendStatus(204);
    return;
}));
exports.bloggersRouter.post('/', middleware_1.isAuthorized, (0, express_validator_1.body)('youtubeUrl').exists().isLength({ max: 100 }).isURL(), (0, express_validator_1.body)('name').trim().exists().isLength({ min: 1, max: 15 }).isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, youtubeUrl } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    const createdBlogger = yield BloggersBusiness_1.bloggersRepo.createBlogger(name, youtubeUrl);
    res.status(201).send(createdBlogger);
    return;
}));
exports.bloggersRouter.put('/:id', middleware_1.isAuthorized, middleware_1.isValidBlogger, (0, express_validator_1.body)('youtubeUrl').exists().isLength({ max: 100 }).isURL(), (0, express_validator_1.body)('name').trim().exists().isLength({ min: 1, max: 15 }).isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, youtubeUrl } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        res.end();
        return;
    }
    yield BloggersBusiness_1.bloggersRepo.updateBloggerById(req.params.id, name, youtubeUrl);
    res.sendStatus(204);
    return;
}));
exports.bloggersRouter.get('/:bloggerId/posts', middleware_1.isValidBlogger, middleware_1.addUserCredentials, (0, express_validator_1.query)('PageNumber').isInt().optional({ checkFalsy: true }), (0, express_validator_1.query)('PageSize').isInt().optional({ checkFalsy: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined;
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(200).send(yield BloggersBusiness_1.bloggersRepo.getBloggerPosts(pageNumber, pageSize, req.params.bloggerId, req.currentUser || null));
    return;
}));
exports.bloggersRouter.post('/:bloggerId/posts', middleware_1.isAuthorized, middleware_1.isValidBlogger, (0, express_validator_1.body)('title').trim().notEmpty().isLength({ max: 30 }), (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }), (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 1000 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(201).send(yield BloggersBusiness_1.bloggersRepo.createBloggerPost(title, shortDescription, content, req.params.bloggerId, req.currentUser || null));
    return;
}));
