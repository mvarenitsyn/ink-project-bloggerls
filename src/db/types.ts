import {ObjectId, WithId, Document} from 'mongodb'
export type bloggerType = {
    "_id": ObjectId,
    "id": number,
    "name": string,
    "youtubeUrl": string
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