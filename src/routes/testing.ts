import {Request, Response, Router} from "express";
import {bloggersCollection, commentsCollection, postsCollection, refreshTokens, usersCollection} from "../db/data";

export const testing = Router({})

testing.delete('/all-data', async (req: Request, res: Response) => {
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await refreshTokens.deleteMany({})
    res.sendStatus(204)
    return
})