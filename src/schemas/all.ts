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
        createdAt: Date,
        postId: String
    }
)

export const postSchema = new Schema<postInterface>(
    {
        _id: ObjectId,
        id: String,
        createdAt: Date,
        title: String,
        shortDescription: String,
        content: String,
        blogId: String,
        blogName: String,
    }
)

export const refreshTokenSchema = new Schema<refreshToken>(
    {
        _id: ObjectId,
        deviceId: String,
        issuedAt: Date,
        deviceName: String,
        token: String,
        validUntil: Date,
        valid: Boolean,
        user: String,
        ip: String
    }
)

export const LikeSchema = new Schema<like>(
    {
        _id: ObjectId,
        addedAt: Date,
        userId: String,
        login: String,
        myStatus: String,
        parentId: String
    }
)