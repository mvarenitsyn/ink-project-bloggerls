
import {postsCollection} from "../db/data";
import {postInterface} from "../db/types";

export const postsRepo = {

    getPosts: async (pageNum: number, pageSize: number, bloggerId?:number): Promise<[number, Object[]]> => {
        const filter = bloggerId ? {bloggerId: bloggerId} :{}

        const resultCount = await postsCollection.countDocuments(filter)
        const posts = await postsCollection.find(filter, {projection: {_id: 0}})
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return [resultCount, posts]
    },

    getPostById: async (id: string) => {
        const filter = {id: id}
        return await postsCollection.findOne(filter, {projection: {_id: 0}})
    },

    deletePostById: async (id: number) => {
        const filter = {id: id}
        await postsCollection.deleteOne(filter)
        return
    },

    updatePostById: async (id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string | undefined) => {
        const filter = {id: id}
        await postsCollection.updateOne(filter, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: bloggerName
            }
        })
        return
    },

    createPost: async (post: postInterface) => {
        try {
            await postsCollection.insertOne(post)
            return {
                "id": post.id,
                "title": post.title,
                "shortDescription": post.shortDescription,
                "content": post.content,
                "bloggerId": post.bloggerId,
                "bloggerName": post.bloggerName
            }
        }
        catch (err) {
            console.log(err)
        }

    },

}