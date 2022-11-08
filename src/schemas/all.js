"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeSchema = exports.refreshTokenSchema = exports.postSchema = exports.commentSchema = exports.bloggerSchema = exports.userSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    userData: {
        login: String,
        password: String,
        email: String,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    }
});
exports.bloggerSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    id: String,
    name: String,
    youtubeUrl: String
});
exports.commentSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    content: String,
    userId: String,
    userLogin: String,
    addedAt: Date,
    postId: String
});
exports.postSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    id: String,
    addedAt: Date,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String,
});
exports.refreshTokenSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    token: String,
    validUntil: Date,
    valid: Boolean,
    user: String
});
exports.LikeSchema = new mongoose_1.Schema({
    _id: mongodb_1.ObjectId,
    addedAt: Date,
    userId: String,
    login: String,
    myStatus: String,
    parentId: String
});
