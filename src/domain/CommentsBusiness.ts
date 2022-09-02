import {commentDBType, userDBtype} from "../db/types";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/CommentsRepository";

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
            }
        } else {
            throw new Error('Comment posting failed')
        }
    },

    getCommentsByPostId: async (postId: string, pageNumber: number = 1, pageSize: number = 10) => {
        const userCount = await commentsRepository.countComments({postId: postId})
        const pagesCount = Math.ceil(userCount/pageSize)
        const comments = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": comments
        }
    },

    async updateComment(id: string, content: string) {
        return await commentsRepository.updateComment(new ObjectId(id), content)
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(new ObjectId(id))
    },
    async getCommentById(id: string) {
        try {
            return await commentsRepository.getCommentById(id)
        }
        catch (e) {
            return null
        }
    }
}