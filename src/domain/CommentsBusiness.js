"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepo = void 0;
const mongodb_1 = require("mongodb");
const CommentsRepository_1 = require("../repositories/CommentsRepository");
const LikesRepository_1 = require("../repositories/LikesRepository");
exports.commentsRepo = {
    createComment: (postId, content, user) => __awaiter(void 0, void 0, void 0, function* () {
        const newComment = {
            _id: new mongodb_1.ObjectId(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.userData.login,
            addedAt: new Date(),
            postId: postId
        };
        const result = yield CommentsRepository_1.commentsRepository.createComment(newComment);
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
            };
        }
        else {
            throw new Error('Comment posting failed');
        }
    }),
    getCommentsByPostId: (postId, pageNumber = 1, pageSize = 10, user) => __awaiter(void 0, void 0, void 0, function* () {
        const userCount = yield CommentsRepository_1.commentsRepository.countComments({ postId: postId });
        const pagesCount = Math.ceil(userCount / pageSize);
        const comments = yield CommentsRepository_1.commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize);
        const newA = [];
        for (const comment of comments) {
            let postLikes = user ? new LikesRepository_1.Likes(comment.id, { userId: user._id, login: user.userData.login }) : new LikesRepository_1.Likes(comment.id);
            const currentUserStatus = yield postLikes.getStatus();
            newA.push(Object.assign(Object.assign({}, comment), { likesInfo: {
                    likesCount: yield postLikes.getLikesCount(),
                    dislikesCount: yield postLikes.getDislikesCount(),
                    myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None',
                } }));
        }
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": newA
        };
    }),
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CommentsRepository_1.commentsRepository.updateComment(new mongodb_1.ObjectId(id), content);
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CommentsRepository_1.commentsRepository.deleteComment(new mongodb_1.ObjectId(id));
        });
    },
    getCommentById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield CommentsRepository_1.commentsRepository.getCommentById(id);
                const commentLikes = user ? new LikesRepository_1.Likes(id, { userId: user._id, login: user.userData.login }) : new LikesRepository_1.Likes(id);
                const currentUserStatus = yield commentLikes.getStatus();
                return Object.assign(Object.assign({}, comment), { likesInfo: {
                        likesCount: yield commentLikes.getLikesCount(),
                        dislikesCount: yield commentLikes.getDislikesCount(),
                        myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None'
                    } });
            }
            catch (e) {
                return null;
            }
        });
    },
    setLike: (commentId, status, user) => __awaiter(void 0, void 0, void 0, function* () {
        const like = new LikesRepository_1.Likes(commentId, { userId: user._id, login: user.userData.login });
        switch (status) {
            case 'Like':
                yield like.like();
                break;
            case 'Dislike':
                yield like.dislike();
                break;
            default:
                yield like.reset();
        }
    })
};
