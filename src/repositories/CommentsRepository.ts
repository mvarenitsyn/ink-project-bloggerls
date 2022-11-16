import {commentDBType} from "../db/types";
import {CommentModel, commentsCollection, UserModel} from "../db/data";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    createComment: async (newComment: commentDBType) => {
        const comment = new CommentModel(newComment)
        return await comment.save().then(result => {
            return result._id
        }).catch(err => {
            return false
        })
    },
    getCommentById: async (id: string) => {
        const comments = await CommentModel.aggregate([
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
        ])

        return comments[0]

    },
    updateComment: async (id: ObjectId, content: string) => {
        console.log(id, content)
        return CommentModel.updateOne({_id: id}, {content: content})
    },
    deleteComment: async (id: ObjectId) => {
        return CommentModel.deleteOne({_id: id})
    },
    getCommentsByPostId: async (postId: string, pageNum: number, pageSize: number) => {
        const comments =  await CommentModel.find({postId: postId})
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .lean()
        return comments.map(comment => {
            return {
                id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.createdAt
            }
        })
    },
    countComments: async (filter: Object) => {
        return CommentModel.countDocuments(filter)
    },
}

