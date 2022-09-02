import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {ObjectId} from "mongodb";
import {postsRepo} from "../repositories/PostsRepository";

export const bloggersRepo = {


    getBloggers: async (searchNameTerm: string | null = null, pageNumber: number = 1, pageSize: number = 10) => {
        const bloggersData = await bloggersDBRepository.getBloggers(searchNameTerm, pageNumber, pageSize)
        const pagesCount = Math.ceil(bloggersData[0] / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": bloggersData[0],
            "items": bloggersData[1]
        }
    },
    createBlogger: async (name:string, youtubeUrl:string) => {
       const newBlogger = {
           "_id": new ObjectId(),
           "id": Number(new Date()).toString(),
           "name": name,
           "youtubeUrl": youtubeUrl
       }
        await bloggersDBRepository.createBlogger(newBlogger)
        return {
            "id": newBlogger.id,
            "name": newBlogger.name,
            "youtubeUrl": newBlogger.youtubeUrl
        }
    },
    updateBloggerById: async (id:string, name:string, youtubeUrl:string) => {
        return await bloggersDBRepository.updateBloggerById(id, name, youtubeUrl)
    },

    deleteBlogger: async (id:string) => {
        return await bloggersDBRepository.deleteBloggerById(id)
    },

    getBloggerById: async (id:string) => {
        return await bloggersDBRepository.getBloggerById(id)
    },

    getBloggerPosts: async (pageNumber: number = 1, pageSize: number = 10, bloggerId: string) => {
        const postsData = await postsRepo.getPosts(pageNumber, pageSize, bloggerId)
        const pagesCount = Math.ceil(postsData[0] / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": postsData[1]
        }
    },
    createBloggerPost: async (title: string, shortDescription: string, content: string, bloggerId: string) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        const newPost = {
            "_id": new ObjectId(),
            "addedAt": new Date(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName" : blogger!.name
        }
        await postsRepo.createPost(newPost)
        return {
            "bloggerId": newPost.bloggerId.toString(),
            "bloggerName": newPost.bloggerName,
            "content": newPost.content,
            "id": newPost.id.toString(),
            "shortDescription": newPost.shortDescription,
            "title": newPost.title
        }
    }

}