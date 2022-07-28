import {ObjectId, WithId, Document} from 'mongodb'
export type bloggerDBType = {
    "_id": ObjectId,
    "id": number,
    "name": string,
    "youtubeUrl": string
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
