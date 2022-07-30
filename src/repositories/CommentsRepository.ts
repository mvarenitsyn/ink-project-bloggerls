import {commentDBType} from "../db/types";
import {commentsCollection} from "../db/data";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    createComment: async (newComment: commentDBType) => {
        return await commentsCollection.insertOne(newComment)
    },
    getCommentById: async (id: string) => {
        const comments = await commentsCollection.aggregate([
            {$match: {
                _id: new ObjectId(id)
            }},
            {$project:
                    {
                        "id": {$toString: "$_id"},
                        _id:0,
                        "content":1,
                        "userId":1,
                        "userLogin":1,
                        "addedAt": 1
                    }
            },
        ]).toArray()

        return comments[0]

    },
    updateComment: async (id: ObjectId, content: string) => {
        console.log(id, content)
        return await commentsCollection.updateOne({_id: id}, {$set: {content: content}})
    },
    deleteComment: async (id: ObjectId) => {
        return await commentsCollection.deleteOne({_id: id})
    },
    getCommentsByPostId: async (postId: string, pageNum: number, pageSize: number) => {
        return await commentsCollection.find({postId: postId})
            .skip((pageNum - 1) * pageSize)
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