import {ObjectId, WithId, Document} from 'mongodb'
export type bloggerDBType = {
    "_id": ObjectId,
    "id": number,
    "name": string,
    "youtubeUrl": string
}

export type commentDBType = {
    "_id": ObjectId,
    "content": string,
    "userId": string,
    "userLogin": string,
    "addedAt": Date,
    "postId": number
}

export type userDBtype = {
    "_id": ObjectId,
    "login": string,
    "password": string
}

export interface postInterface extends WithId<Document>{
    "_id": ObjectId,
    "id": number,
    "title": string,
    "shortDescription": string,
    "content": string,
    "bloggerId": number,
    "bloggerName": string
}

