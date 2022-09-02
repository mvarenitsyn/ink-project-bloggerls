import {ObjectId, WithId, Document} from 'mongodb'
export type bloggerDBType = {
    "_id": ObjectId,
    "id": string,
    "name": string,
    "youtubeUrl": string
}

export type commentDBType = {
    "_id": ObjectId,
    "content": string,
    "userId": string,
    "userLogin": string,
    "addedAt": Date,
    "postId": string,
}

export type userDBtype = {
    "_id": ObjectId,
    "userData": {
        "login": string,
        "password": string
        "email": string,
        "createdAt": Date
    }
    "emailConfirmation": {
        confirmationCode: string,
        expirationDate: Date
        isConfirmed: boolean
    }
}

export interface postInterface extends WithId<Document>{
    "_id": ObjectId,
    "id": string,
    "addedAt": Date,
    "title": string,
    "shortDescription": string,
    "content": string,
    "bloggerId": string,
    "bloggerName": string
}

export type logDBtype = {
    _id: ObjectId,
    action: string,
    ip: string,
    time: Date
}

export type refreshToken = {
    _id: ObjectId,
    token: string,
    validUntil: Date,
    valid: boolean,
    user: string
}

export type like = {
    _id: ObjectId,
    addedAt: Date,
    userId: string,
    login: string,
    status: string,
    parentId: string
}