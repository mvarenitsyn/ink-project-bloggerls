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
exports.postsBusiness = void 0;
const PostsRepository_1 = require("../repositories/PostsRepository");
const mongodb_1 = require("mongodb");
const BloggersBusiness_1 = require("./BloggersBusiness");
const LikesRepository_1 = require("../repositories/LikesRepository");
exports.postsBusiness = {
    getPosts: (pageNumber = 1, pageSize = 10, user) => __awaiter(void 0, void 0, void 0, function* () {
        const postsData = yield PostsRepository_1.postsRepo.getPosts(pageNumber, pageSize);
        const pagesCount = Math.ceil(postsData[0] / pageSize);
        const newA = [];
        for (const post of postsData[1]) {
            let postLikes = user ? new LikesRepository_1.Likes(post.id, { userId: user._id, login: user.userData.login }) : new LikesRepository_1.Likes(post.id);
            const currentUserStatus = yield postLikes.getStatus();
            newA.push(Object.assign(Object.assign({}, post._doc), { extendedLikesInfo: {
                    likesCount: yield postLikes.getLikesCount(),
                    dislikesCount: yield postLikes.getDislikesCount(),
                    myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None',
                    newestLikes: yield postLikes.list(3)
                } }));
        }
        const pageInfo = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": newA
        };
        return pageInfo;
    }),
    updatePostById: (id, title, shortDescription, content, bloggerId) => __awaiter(void 0, void 0, void 0, function* () {
        const blogger = yield BloggersBusiness_1.bloggersRepo.getBloggerById(bloggerId);
        (blogger === null || blogger === void 0 ? void 0 : blogger.name) && (yield PostsRepository_1.postsRepo.updatePostById(id, title, shortDescription, content, bloggerId, blogger === null || blogger === void 0 ? void 0 : blogger.name));
        return;
    }),
    createPost: (title, shortDescription, content, bloggerId) => __awaiter(void 0, void 0, void 0, function* () {
        const blogger = yield BloggersBusiness_1.bloggersRepo.getBloggerById(bloggerId);
        const newPost = {
            "_id": new mongodb_1.ObjectId(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId.toString(),
            "addedAt": new Date(),
            "bloggerName": (blogger === null || blogger === void 0 ? void 0 : blogger.name) || ''
        };
        const createdPost = yield PostsRepository_1.postsRepo.createPost(newPost);
        if (createdPost)
            return Object.assign(Object.assign({}, createdPost), { extendedLikesInfo: {
                    "likesCount": 0,
                    "dislikesCount": 0,
                    "myStatus": "None",
                    "newestLikes": []
                } });
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const postLikes = new LikesRepository_1.Likes(id);
        yield postLikes.deleteAll();
        return yield PostsRepository_1.postsRepo.deletePostById(id);
    }),
    getPostById: (id, user) => __awaiter(void 0, void 0, void 0, function* () {
        const postLikes = user ? new LikesRepository_1.Likes(id, { userId: user._id, login: user.userData.login }) : new LikesRepository_1.Likes(id);
        const post = yield PostsRepository_1.postsRepo.getPostById(id);
        if (!post)
            return null;
        const currentUserStatus = yield postLikes.getStatus();
        const newestLikes = yield postLikes.list(3);
        post.extendedLikesInfo = {
            likesCount: yield postLikes.getLikesCount(),
            dislikesCount: yield postLikes.getDislikesCount(),
            myStatus: currentUserStatus ? currentUserStatus.myStatus : 'None',
            newestLikes: newestLikes.map(like => {
                return {
                    "addedAt": like.addedAt,
                    "userId": like.userId,
                    "login": like.login
                };
            })
        };
        return post;
    }),
    setLike: (postId, status, user) => __awaiter(void 0, void 0, void 0, function* () {
        const like = new LikesRepository_1.Likes(postId, { userId: user._id, login: user.userData.login });
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
