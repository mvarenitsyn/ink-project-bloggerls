import {postsRepo} from "../repositories/PostsRepository";
import {ObjectId} from "mongodb";
import {bloggersRepo} from "./BloggersBusiness";

export const postsBusiness = {
    getPosts: async (pageNumber: number = 1, pageSize: number = 10) => {
        const postsData = await postsRepo.getPosts(pageNumber, pageSize)
        const pagesCount = Math.ceil(postsData[0] / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": postsData[1]
        }
    },

    updatePostById: async (id: number, title: string, shortDescription: string, content: string, bloggerId: string) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        blogger?.name && await postsRepo.updatePostById(id, title, shortDescription, content, bloggerId, blogger?.name)
        return
    },

    createPost: async (title: string, shortDescription: string, content: string, bloggerId: string) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        return postsRepo.createPost({
            "_id": new ObjectId(),
            "id": String(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId.toString(),
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