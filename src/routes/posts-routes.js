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
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const middleware_1 = require("../middleware");
const utils_1 = require("../utils");
const BloggersBusiness_1 = require("../domain/BloggersBusiness");
const PostsBusiness_1 = require("../domain/PostsBusiness");
const CommentsBusiness_1 = require("../domain/CommentsBusiness");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', middleware_1.addUserCredentials, (0, express_validator_1.query)('PageNumber').isInt().optional({ checkFalsy: true }), (0, express_validator_1.query)('PageSize').isInt().optional({ checkFalsy: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined;
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(200).send(yield PostsBusiness_1.postsBusiness.getPosts(pageNumber, pageSize, req.currentUser || null));
    return;
}));
exports.postsRouter.get('/:id', middleware_1.isValidPost, middleware_1.addUserCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(200).send(yield PostsBusiness_1.postsBusiness.getPostById(req.params.id, req.currentUser || null));
    return;
}));
exports.postsRouter.get('/:postId/comments', middleware_1.isValidPost, middleware_1.addUserCredentials, (0, express_validator_1.query)('PageNumber').isInt().optional({ checkFalsy: true }), (0, express_validator_1.query)('PageSize').isInt().optional({ checkFalsy: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined;
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(200).send(yield CommentsBusiness_1.commentsRepo.getCommentsByPostId(req.params.postId, pageNumber, pageSize, req.currentUser));
    return;
}));
exports.postsRouter.post('/', middleware_1.isAuthorized, (0, express_validator_1.body)('title').trim().notEmpty().isLength({ max: 30 }), (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }), (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 1000 }), (0, express_validator_1.body)('bloggerId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield BloggersBusiness_1.bloggersRepo.getBloggerById(value))) {
        return Promise.reject();
    }
})), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, bloggerId } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(201).send(yield PostsBusiness_1.postsBusiness.createPost(title, shortDescription, content, bloggerId));
    return;
}));
exports.postsRouter.post('/:postId/comments', middleware_1.isAuthorized, (0, utils_1.validateSeq)([
    (0, express_validator_1.param)('postId').isInt(),
    (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 300, min: 20 })
]), middleware_1.isValidPost, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    if (req.currentUser) {
        res.status(201).send(yield CommentsBusiness_1.commentsRepo.createComment(req.params.postId, content, req.currentUser));
        return;
    }
    res.sendStatus(401);
    return;
}));
exports.postsRouter.put('/:id', middleware_1.isAuthorized, middleware_1.isValidPost, (0, express_validator_1.body)('title').trim().notEmpty().isLength({ max: 30 }), (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }), (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 1000 }), (0, express_validator_1.body)('bloggerId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield BloggersBusiness_1.bloggersRepo.getBloggerById(value))) {
        return Promise.reject();
    }
})), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, bloggerId } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    yield PostsBusiness_1.postsBusiness.updatePostById(req.params.id, title, shortDescription, content, bloggerId);
    res.sendStatus(204);
    res.end();
}));
exports.postsRouter.put('/:postId/like-status', middleware_1.isAuthorized, middleware_1.isValidPost, (0, express_validator_1.body)('likeStatus').isIn(['Like', 'Dislike', 'None']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { likeStatus } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    if (req.currentUser) {
        yield PostsBusiness_1.postsBusiness.setLike(req.params.postId, likeStatus, req.currentUser);
        res.sendStatus(204);
        return;
    }
    res.sendStatus(401);
    return;
}));
exports.postsRouter.delete('/:id', middleware_1.isAuthorized, middleware_1.isValidPost, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    yield PostsBusiness_1.postsBusiness.deletePost(req.params.id);
    res.sendStatus(204);
    return;
}));
