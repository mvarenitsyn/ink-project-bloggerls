import {postsRepo} from "../repositories/PostsRepository";
import {ObjectId} from "mongodb";
import {bloggersRepo} from "./BloggersBusiness";
import {Likes} from "../repositories/LikesRepository";
import {like, userDBtype, postInterface} from "../db/types";


export const postsBusiness = {
    getPosts: async (pageNumber: number = 1, pageSize: number = 10, user?: userDBtype | null) => {
        const postsData:[number,postInterface[]] = await postsRepo.getPosts(pageNumber, pageSize)
        const pagesCount = Math.ceil(postsData[0] / pageSize)
        const newA:any = []

        for (const post of postsData[1]) {

            let postLikes = user ? new Likes(post.id, {userId: user._id, login: user.userData.login}) : new Likes(post.id)
            const myStatus = !user ? 'None' : await postLikes.getStatus()
            newA.push({
                ...post._doc,
                extendedLikesInfo: {
                    likesCount: await postLikes.getLikesCount(),
                    dislikesCount: await postLikes.getDislikesCount(),
                    status: myStatus,
                    newestLikes: await postLikes.list(3)
                }
            })
        }

        const pageInfo = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": newA
        }

       return pageInfo
    },


    updatePostById: async (id: string, title: string, shortDescription: string, content: string, bloggerId: string) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        blogger?.name && await postsRepo.updatePostById(id, title, shortDescription, content, bloggerId, blogger?.name)
        return
    },

    createPost: async (title: string, shortDescription: string, content: string, bloggerId: string) => {
        const blogger = await bloggersRepo.getBloggerById(bloggerId)
        const newPost = {
            "_id": new ObjectId(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId.toString(),
            "addedAt": new Date(),
            "bloggerName" : blogger?.name || ''
        }
        const createdPost = await postsRepo.createPost(newPost)
        if(createdPost)
        return {
            ...createdPost,
            extendedLikesInfo : {
                "likesCount": 0,
                "dislikesCount": 0,
                "myStatus": "None",
                "newestLikes": [
                ]
            }
        }

    },

    deletePost: async (id:string) => {
        const postLikes = new Likes(id)
        await postLikes.deleteAll()
        return await postsRepo.deletePostById(id)
    },

    getPostById: async (id:string, user?: userDBtype | null) => {
        const postLikes = user ? new Likes(id, {userId: user._id, login: user.userData.login}) : new Likes(id)
        const post =  await postsRepo.getPostById(id)

        if(!post) return null

        const myStatus = !user ? 'None' : await postLikes.getStatus()
        const newestLikes:like[] = await postLikes.list(3)
        post.extendedLikesInfo = {
            likesCount: await postLikes.getLikesCount(),
            dislikesCount: await postLikes.getDislikesCount(),
            myStatus: myStatus,
            newestLikes: newestLikes.map(like => {
                return {
                    "addedAt": like.addedAt,
                    "userId": like.userId,
                    "login": like.login
                }
            })
        }
        return post

    },

    setLike: async (postId: string, status: string, user: userDBtype) => {
        const like = new Likes(postId, {userId: user._id, login: user.userData.login})
        switch (status) {
            case 'Like':
                await like.like()
                break
            case 'Dislike':
                await like.dislike()
                break
            default:
                await like.reset()
        }

    }

}