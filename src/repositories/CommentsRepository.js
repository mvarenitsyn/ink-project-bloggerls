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
exports.commentsRepository = void 0;
const data_1 = require("../db/data");
const mongodb_1 = require("mongodb");
exports.commentsRepository = {
    createComment: (newComment) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = new data_1.CommentModel(newComment);
        return yield comment.save().then(result => {
            return result._id;
        }).catch(err => {
            return false;
        });
    }),
    getCommentById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield data_1.CommentModel.aggregate([
            { $match: {
                    _id: new mongodb_1.ObjectId(id)
                } },
            { $project: {
                    "id": { $toString: "$_id" },
                    _id: 0,
                    "content": 1,
                    "userId": 1,
                    "userLogin": 1,
                    "addedAt": 1
                }
            },
        ]);
        return comments[0];
    }),
    updateComment: (id, content) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(id, content);
        return data_1.CommentModel.updateOne({ _id: id }, { content: content });
    }),
    deleteComment: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.CommentModel.deleteOne({ _id: id });
    }),
    getCommentsByPostId: (postId, pageNum, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield data_1.CommentModel.find({ postId: postId })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .lean();
        return comments.map(comment => {
            return {
                id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt
            };
        });
    }),
    countComments: (filter) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.CommentModel.countDocuments(filter);
    }),
};
