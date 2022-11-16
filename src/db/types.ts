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
    "createdAt": Date,
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
    "createdAt": Date,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string
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
    deviceId: string,
    issuedAt: Date,
    deviceName: string,
    validUntil: Date,
    valid: boolean,
    user: string,
    ip: string
}

export type like = {
    _id: ObjectId,
    createdAt: Date,
    userId: string,
    login: string,
    myStatus: string,
    parentId: string
}