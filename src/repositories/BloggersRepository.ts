
import {bloggersCollection} from "../db/data";
import {bloggerDBType} from "../db/types";


export const bloggersDBRepository = {

    getBloggers: async (name: string | null, pageNum: number, pageSize: number):Promise<[number, Object[]]> =>  {
        const filter = name ? {name: {$regex: name, $options: 'ig'}} : {}

        const resultCount = await bloggersCollection.countDocuments(filter)
        const bloggers = await bloggersCollection.find(filter, {projection:
                {
                    _id: 0,
                }})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .toArray()
        return [resultCount, bloggers]
    },

    getBloggerById: async (id: string) => {
        const filter = {id: id}
        return await bloggersCollection.findOne(filter, {projection:{ _id: 0 }})
    },

    deleteBloggerById: async (id: string) => {
        const filter = {id: id}
        return await bloggersCollection.deleteOne(filter)
    },

    updateBloggerById: async (id: string, name: string, youtubeUrl: string) => {
        const filter = {id: id}
        return await bloggersCollection.updateOne(filter, {$set:{ name: name, youtubeUrl: youtubeUrl }})
    },

    createBlogger: async (blogger: bloggerDBType) => {
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