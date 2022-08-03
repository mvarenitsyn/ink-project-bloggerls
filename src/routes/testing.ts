import {Request, Response, Router} from "express";
import {bloggersCollection, commentsCollection, postsCollection, usersCollection} from "../db/data";

export const testing = Router({})

testing.delete('/all-data'), async (req: Request, res: Response) => {
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
}