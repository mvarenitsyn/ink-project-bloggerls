import {PostModel, postsCollection, UserModel} from "../db/data";
import {postInterface, userDBtype} from "../db/types";

export const postsRepo = {

    getPosts: async (pageNum: number, pageSize: number, bloggerId?: string):Promise<[number, postInterface[]]> => {
        const filter = bloggerId ? {blogId: bloggerId} : {}

        const resultCount = await PostModel.countDocuments(filter)
        const posts = await PostModel.find(filter).select('-_id -__v').sort({createdAt: "descending"})
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
            blogId: bloggerId,
            blogName: bloggerName
        })
        return
    },

    createPost: async (post: postInterface) => {

        //await PostModel.insertOne(post)
        const newPost = new PostModel(post)
        return await newPost.save().then(result => {
            return {
                "id": post.id,
                "createdAt": post.createdAt,
                "title": post.title,
                "shortDescription": post.shortDescription,
                "content": post.content,
                "blogId": post.blogId,
                "blogName": post.blogName
            }
        }).catch(err => {
            return {}
        })

    },


}