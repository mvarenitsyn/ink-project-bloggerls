import {MongoClient} from 'mongodb'
import {bloggerDBType, commentDBType, postInterface, userDBtype} from './types'
import 'dotenv/config'

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017'

const client = new MongoClient(mongoUri)
const db = client.db("merndb")

export const bloggersCollection = db.collection<bloggerDBType>('bloggers')
export const usersCollection = db.collection<userDBtype>('users')
export const commentsCollection = db.collection<commentDBType>('comments')
export const postsCollection = db.collection<postInterface>('posts')

export const connectDB = async() => {
    try {
        await client.connect()
        console.log("Database connection was successfully")
    } catch (error) {
        console.log("Can't connect to database on "+mongoUri)
        await client.close()
    }
}