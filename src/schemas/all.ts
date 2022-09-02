import {bloggerDBType, commentDBType, like, postInterface, refreshToken, userDBtype} from "../db/types";
import {ObjectId} from "mongodb";
import {Schema} from "mongoose";

export const userSchema = new Schema<userDBtype> (
    {
        _id: ObjectId,
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
    }
)

export const bloggerSchema = new Schema<bloggerDBType>(
    {
    _id: ObjectId,
    id: String,
    name: String,
    youtubeUrl: String
    }
)

export const commentSchema = new Schema<commentDBType>(
    {
        _id: ObjectId,
        content: String,
        userId: String,
        userLogin: String,
        addedAt: Date,
        postId: String
    }
)

export const postSchema = new Schema<postInterface>(
    {
        _id: ObjectId,
        id: String,
        addedAt: Date,
        title: String,
        shortDescription: String,
        content: String,
        bloggerId: String,
        bloggerName: String,
    }
)

export const refreshTokenSchema = new Schema<refreshToken>(
    {
        _id: ObjectId,
        token: String,
        validUntil: Date,
        valid: Boolean,
        user: String
    }
)

export const LikeSchema = new Schema<like>(
    {
        _id: ObjectId,
        addedAt: Date,
        userId: String,
        login: String,
        status: String,
        parentId: String
    }
)