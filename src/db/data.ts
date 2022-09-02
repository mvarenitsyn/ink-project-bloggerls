import {MongoClient, ObjectId} from 'mongodb'
import mongoose from 'mongoose';
import {bloggerDBType, commentDBType, logDBtype, postInterface, refreshToken, userDBtype} from './types'
import 'dotenv/config'
import {bloggerSchema, commentSchema, LikeSchema, postSchema, refreshTokenSchema, userSchema} from "../schemas/all";

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017'

const client = new MongoClient(mongoUri)
const db = client.db("merndb")

export const bloggersCollection = db.collection<bloggerDBType>('bloggers')
export const usersCollection = db.collection<userDBtype>('users')
export const commentsCollection = db.collection<commentDBType>('comments')
export const logsCollection = db.collection<logDBtype>('logs')
export const postsCollection = db.collection<postInterface>('posts')
export const refreshTokens = db.collection<refreshToken>('refreshtokens')




export const UserModel = mongoose.model('User', userSchema)
export const CommentModel = mongoose.model('Comment', commentSchema)
export const PostModel = mongoose.model('Post', postSchema)
export const BloggerModel = mongoose.model('Blogger', bloggerSchema)
export const RefreshTokenModel = mongoose.model('Refreshtoken', refreshTokenSchema)
export const LikesModel = mongoose.model('Like', LikeSchema)

//UserModel.watch().on('change', data => console.log(new Date(), data));

export const connectDB = async() => {
    try {
        //await client.connect()
        await mongoose.connect(mongoUri+'/merndb');
        console.log("Database connection was successfully")
    } catch (error) {
        console.log("Can't connect to database on "+mongoUri)
        //await client.close()
        await mongoose.disconnect()
    }
}