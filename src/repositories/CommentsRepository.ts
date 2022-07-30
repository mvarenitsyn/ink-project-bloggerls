import {commentDBType} from "../db/types";
import {commentsCollection, usersCollection} from "../db/data";

export const commentsRepository = {
    createComment: async (newComment: commentDBType) => {
        return await commentsCollection.insertOne(newComment)
    },
    getCommentsByPostId: async (postId: number, pageNum: number, pageSize: number) => {
        return await commentsCollection.find({postId:postId})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .map(comment => {
                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    addedAt: comment.addedAt
                }
            })
            .toArray()
    },
    countComments: async (filter: Object) => {
        return commentsCollection.countDocuments(filter)
    },
}