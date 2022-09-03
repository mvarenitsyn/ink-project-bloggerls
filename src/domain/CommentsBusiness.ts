import {commentDBType, like, userDBtype} from "../db/types";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/CommentsRepository";
import {Likes} from "../repositories/LikesRepository";

export const commentsRepo = {
    createComment: async (postId: string, content: string, user: userDBtype) => {
        const newComment: commentDBType = {
            _id: new ObjectId(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.userData.login,
            addedAt: new Date(),
            postId: postId
        }
        const result = await commentsRepository.createComment(newComment)
        if (result) {
            return {
                id: result,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            }
        } else {
            throw new Error('Comment posting failed')
        }
    },

    getCommentsByPostId: async (postId: string, pageNumber: number = 1, pageSize: number = 10, user?: userDBtype | null) => {
        const userCount = await commentsRepository.countComments({postId: postId})
        const pagesCount = Math.ceil(userCount/pageSize)
        const comments = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        const newA:any = []

        for (const comment of comments) {

            let postLikes = user ? new Likes(comment.id, {userId: user._id, login: user.userData.login}) : new Likes(comment.id)
            const currentUserStatus = await postLikes.getStatus()
            newA.push({
                ...comment,
                likesInfo: {
                    likesCount: await postLikes.getLikesCount(),
                    dislikesCount: await postLikes.getDislikesCount(),
                    myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None',
                }
            })
        }

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": newA
        }
    },

    async updateComment(id: string, content: string) {
        return await commentsRepository.updateComment(new ObjectId(id), content)
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(new ObjectId(id))
    },
    async getCommentById(id: string, user?: userDBtype | null) {
        try {
            const comment = await commentsRepository.getCommentById(id)
            const commentLikes = user ? new Likes(id, {userId: user._id, login: user.userData.login}) : new Likes(id)
            const currentUserStatus = await commentLikes.getStatus()
            return {
                ...comment,
                likesInfo: {
                    likesCount: await commentLikes.getLikesCount(),
                    dislikesCount: await commentLikes.getDislikesCount(),
                    myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None'
                }
            }
        }
        catch (e) {
            return null
        }
    },

    setLike: async (commentId: string, status: string, user: userDBtype) => {
        const like = new Likes(commentId, {userId: user._id, login: user.userData.login})
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