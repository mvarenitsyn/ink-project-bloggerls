import {Request, Response, Router} from "express";
import {
    BloggerModel,
    CommentModel, LikesModel,
    PostModel,
    RefreshTokenModel,
    UserModel
} from "../db/data";

export const testing = Router({})

testing.delete('/all-data', async (req: Request, res: Response) => {
    await BloggerModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.deleteMany({})
    await CommentModel.deleteMany({})
    await RefreshTokenModel.deleteMany({})
    //await LikesModel.deleteMany({})
    res.sendStatus(204)
    return
})