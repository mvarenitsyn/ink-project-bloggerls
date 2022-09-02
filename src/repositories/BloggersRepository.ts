
import {BloggerModel, bloggersCollection, UserModel} from "../db/data";
import {bloggerDBType} from "../db/types";


export const bloggersDBRepository = {

    getBloggers: async (name: string | null, pageNum: number, pageSize: number):Promise<[number, Object[]]> =>  {
        const filter = name ? {name: {$regex: name, $options: 'ig'}} : {}

        const resultCount = await BloggerModel.countDocuments(filter)
        const bloggers = await BloggerModel.find(filter, {projection:
                {
                    _id: 0,
                }})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .lean()
        return [resultCount, bloggers]
    },

    getBloggerById: async (id: string) => {
        const filter = {id: id}
        return BloggerModel.findOne(filter, {projection:{ _id: 0 }})
    },

    deleteBloggerById: async (id: string) => {
        const filter = {id: id}
        return BloggerModel.deleteOne(filter)
    },

    updateBloggerById: async (id: string, name: string, youtubeUrl: string) => {
        const filter = {id: id}
        return BloggerModel.updateOne(filter, {$set:{ name: name, youtubeUrl: youtubeUrl }})
    },

    createBlogger: async (blogger: bloggerDBType) => {
        const newBlogger = new BloggerModel(blogger)
        return await newBlogger.save().then(result => {
            return {
                "id": result.id,
                "name": result.name,
                "youtubeUrl": result.youtubeUrl
            }
        }).catch(err => {
            return false
        })


    },

}