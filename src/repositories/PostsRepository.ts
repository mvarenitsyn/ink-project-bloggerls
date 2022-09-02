import {PostModel, postsCollection, UserModel} from "../db/data";
import {postInterface, userDBtype} from "../db/types";

export const postsRepo = {

    getPosts: async (pageNum: number, pageSize: number, bloggerId?: string):Promise<[number, postInterface[]]> => {
        const filter = bloggerId ? {bloggerId: bloggerId} : {}

        const resultCount = await PostModel.countDocuments(filter)
        const posts = await PostModel.find(filter).select('-_id -__v')
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec()
        return [resultCount, posts]
    },

    getPostById: async (id: string) => {
        const filter = {id: id}
        return PostModel.findOne(filter).select('-_id -__v').lean().exec()
    },

    deletePostById: async (id: string) => {
        const filter = {id: id}
        return PostModel.deleteOne(filter)
    },

    updatePostById: async (id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string | undefined) => {
        const filter = {id: id}
        await PostModel.updateOne(filter, {
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
        })
        return
    },

    createPost: async (post: postInterface) => {

        //await PostModel.insertOne(post)
        const newPost = new PostModel(post)
        return await newPost.save().then(result => {
            return {
                "id": post.id,
                "title": post.title,
                "shortDescription": post.shortDescription,
                "content": post.content,
                "bloggerId": post.bloggerId,
                "bloggerName": post.bloggerName
            }
        }).catch(err => {
            return false
        })

    },


}