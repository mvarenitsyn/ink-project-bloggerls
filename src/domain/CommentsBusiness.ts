import {commentDBType, userDBtype} from "../db/types";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/CommentsRepository";
import {usersDBRepository} from "../repositories/UsersRepository";

export const commentsRepo = {
    createComment: async (postId: number, content: string, user: userDBtype) => {
        const newComment: commentDBType = {
            _id: new ObjectId(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.login,
            addedAt: new Date(),
            postId: postId
        }
        const result = await commentsRepository.createComment(newComment)
        if (result.acknowledged) {
            return {
                id: result.insertedId,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt,
            }
        } else {
            throw new Error('Comment posting failed')
        }
    },

    getCommentsByPostId: async (postId: number, pageNumber: number = 1, pageSize: number = 10) => {
        const userCount = await commentsRepository.countComments({})
        const pagesCount = Math.ceil(userCount/pageSize)
        const comments = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": comments
        }
    }
}