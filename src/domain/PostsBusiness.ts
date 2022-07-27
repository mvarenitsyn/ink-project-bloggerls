import { postsDB } from "../db/db";
import {postsCollection} from "../db/data";
import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {postsRepo} from "../repositories/PostsRepository";
import {postInterface} from "../db/types";
import {ObjectId} from "mongodb";
import {bloggersRepo} from "./BloggersBusiness";

export const postsBusiness = {
    getPosts: async (pageNumber: number = 1, pageSize: number = 10) => {
        const postsData = await postsRepo.getPosts(pageNumber, pageSize)
        const pagesCount = postsData[0] < pageSize ? 1 : Math.round(postsData[0] / pageSize) + (postsData[0] % pageSize > 0 ? 1 : 0)
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": postsData[1]
        }
    },

    updatePostById: async (id: number, title: string, shortDescription: string, content: string, bloggerId: number) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        blogger?.name && await postsRepo.updatePostById(id, title, shortDescription, content, bloggerId, blogger?.name)
        return
    },

    createPost: async (title: string, shortDescription: string, content: string, bloggerId: number) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        return postsRepo.createPost({
            "_id": new ObjectId(),
            "id": Number(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName" : blogger?.name || ''
        })
    },

    deletePost: async (id:number) => {
        return await postsRepo.deletePostById(id)
    },

    getPostById: (id:number) => {
        return postsRepo.getPostById(id)
    }

}