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
exports.commentsRoutes = void 0;
const express_1 = require("express");
const CommentsBusiness_1 = require("../domain/CommentsBusiness");
const middleware_1 = require("../middleware");
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
exports.commentsRoutes = (0, express_1.Router)({});
exports.commentsRoutes.get('/:id', middleware_1.addUserCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield CommentsBusiness_1.commentsRepo.getCommentById(req.params.id, req.currentUser);
    if (comment) {
        res.status(200).json(comment);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
}));
exports.commentsRoutes.delete('/:commentId', middleware_1.isAuthorized, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = (0, utils_1.isObjectId)(req.params.commentId) ? yield CommentsBusiness_1.commentsRepo.getCommentById(req.params.commentId) : undefined;
    if (comment) {
        const currentUserId = req.currentUser._id.toString();
        if (currentUserId === comment.userId) {
            yield CommentsBusiness_1.commentsRepo.deleteComment(req.params.commentId);
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(403);
            return;
        }
    }
    else {
        res.sendStatus(404);
        return;
    }
}));
exports.commentsRoutes.put('/:commentId', middleware_1.isAuthorized, (0, express_validator_1.body)('content').isLength({ min: 20, max: 300 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    const comment = (0, utils_1.isObjectId)(req.params.commentId) ? yield CommentsBusiness_1.commentsRepo.getCommentById(req.params.commentId) : undefined;
    if (comment) {
        const currentUserId = req.currentUser._id.toString();
        if (currentUserId === comment.userId) {
            yield CommentsBusiness_1.commentsRepo.updateComment(req.params.commentId, req.body.content);
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(403);
            return;
        }
    }
    else {
        res.sendStatus(404);
        return;
    }
}));
exports.commentsRoutes.put('/:commentId/like-status', middleware_1.isAuthorized, (0, express_validator_1.body)('likeStatus').isIn(['Like', 'Dislike', 'None']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { likeStatus } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    const comment = yield CommentsBusiness_1.commentsRepo.getCommentById(req.params.commentId, req.currentUser);
    if (comment && req.currentUser) {
        yield CommentsBusiness_1.commentsRepo.setLike(req.params.commentId, likeStatus, req.currentUser);
        res.sendStatus(204);
        return;
    }
    res.sendStatus(404);
    return;
}));
