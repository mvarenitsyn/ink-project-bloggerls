import { bloggersDB } from "../db/db";
import {bloggersCollection} from "../db/data";
import {bloggerType} from "../db/types";
import {postsRepo} from "./PostsRepository";

export const bloggersDBRepository = {

    getBloggers: async (name: string | null, pageNum: number, pageSize: number):Promise<[number, Object[]]> =>  {
        const filter = name ? {name: {$regex: name, $options: 'ig'}} : {}

        const resultCount = await bloggersCollection.countDocuments(filter)
        const bloggers = await bloggersCollection.find(filter, {projection:{ _id: 0 }})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .toArray()
        return [resultCount, bloggers]
    },

    getBloggerById: async (id: number) => {
        const filter = {id: id}
        const blogger = await bloggersCollection.findOne(filter, {projection:{ _id: 0 }})
        return blogger
    },

    deleteBloggerById: async (id: number) => {
        const filter = {id: id}
        const blogger = await bloggersCollection.deleteOne(filter)
        return
    },

    updateBloggerById: async (id: number, name: string, youtubeUrl: string) => {
        const filter = {id: id}
        const blogger = await bloggersCollection.updateOne(filter, {$set:{ name: name, youtubeUrl: youtubeUrl }})

        return
    },

    createBlogger: async (blogger: bloggerType) => {
        try {
            await bloggersCollection.insertOne(blogger)
            return {
                "id": blogger.id,
                "name": blogger.name,
                "youtubeUrl": blogger.youtubeUrl
            }
        }
        catch (err) {
            console.log(err)
        }

    },

}