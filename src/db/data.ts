import {MongoClient} from 'mongodb'
import {bloggerType, postInterface} from './types'

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mern-app:blogger123@cluster0.vrb5bdm.mongodb.net' || 'mongodb://localhost:27017'

const client = new MongoClient(mongoUri)
const db = client.db("merndb")

export const bloggersCollection = db.collection<bloggerType>('bloggers')
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