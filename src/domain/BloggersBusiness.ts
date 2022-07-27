import {bloggersDBRepository} from "../repositories/BloggersRepository";
import {ObjectId} from "mongodb";
import {postsRepo} from "../repositories/PostsRepository";
import {postsCollection} from "../db/data";

export const bloggersRepo = {


    getBloggers: async (searchNameTerm: string | null = null, pageNumber: number = 1, pageSize: number = 10) => {
        const bloggersData = await bloggersDBRepository.getBloggers(searchNameTerm, pageNumber, pageSize)
        const pagesCount = Math.floor(bloggersData[0] / pageSize)
        return {
            "pagesCount": pagesCount+1,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": bloggersData[0],
            "items": bloggersData[1]
        }
    },
    createBlogger: async (name:string, youtubeUrl:string) => {
       return await bloggersDBRepository.createBlogger({
           "_id": new ObjectId(),
           "id": Number(new Date()),
           "name": name,
           "youtubeUrl": youtubeUrl
        })
    },
    updateBloggerById: async (id:number, name:string, youtubeUrl:string) => {
        return await bloggersDBRepository.updateBloggerById(id, name, youtubeUrl)
    },

    deleteBlogger: async (id:number) => {
        return await bloggersDBRepository.deleteBloggerById(id)
    },

    getBloggerById: async (id:number) => {
        const blogger = await bloggersDBRepository.getBloggerById(id)
        return blogger
    },

    getBloggerPosts: async (pageNumber: number = 1, pageSize: number = 10, bloggerId: number) => {
        const postsData = await postsRepo.getPosts(pageNumber, pageSize, bloggerId)
        const pagesCount = Math.floor(postsData[0] / pageSize)
        return {
            "pagesCount": pagesCount+1,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": postsData[1]
        }
    },
    createBloggerPost: async (title: string, shortDescription: string, content: string, bloggerId: number) => {
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
    }
    ,

}