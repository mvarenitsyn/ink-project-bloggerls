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
exports.bloggersRepo = void 0;
const BloggersRepository_1 = require("../repositories/BloggersRepository");
const mongodb_1 = require("mongodb");
const PostsRepository_1 = require("../repositories/PostsRepository");
const LikesRepository_1 = require("../repositories/LikesRepository");
exports.bloggersRepo = {
    getBloggers: (searchNameTerm = null, pageNumber = 1, pageSize = 10) => __awaiter(void 0, void 0, void 0, function* () {
        const bloggersData = yield BloggersRepository_1.bloggersDBRepository.getBloggers(searchNameTerm, pageNumber, pageSize);
        const pagesCount = Math.ceil(bloggersData[0] / pageSize);
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": bloggersData[0],
            "items": bloggersData[1]
        };
    }),
    createBlogger: (name, youtubeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlogger = {
            "_id": new mongodb_1.ObjectId(),
            "id": Number(new Date()).toString(),
            "name": name,
            "youtubeUrl": youtubeUrl
        };
        yield BloggersRepository_1.bloggersDBRepository.createBlogger(newBlogger);
        return {
            "id": newBlogger.id,
            "name": newBlogger.name,
            "youtubeUrl": newBlogger.youtubeUrl
        };
    }),
    updateBloggerById: (id, name, youtubeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        return yield BloggersRepository_1.bloggersDBRepository.updateBloggerById(id, name, youtubeUrl);
    }),
    deleteBlogger: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield BloggersRepository_1.bloggersDBRepository.deleteBloggerById(id);
    }),
    getBloggerById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield BloggersRepository_1.bloggersDBRepository.getBloggerById(id);
    }),
    getBloggerPosts: (pageNumber = 1, pageSize = 10, bloggerId, user) => __awaiter(void 0, void 0, void 0, function* () {
        const postsData = yield PostsRepository_1.postsRepo.getPosts(pageNumber, pageSize, bloggerId);
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
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": newA
        };
    }),
    createBloggerPost: (title, shortDescription, content, bloggerId, user) => __awaiter(void 0, void 0, void 0, function* () {
        const blogger = yield exports.bloggersRepo.getBloggerById(bloggerId);
        const newPost = {
            "_id": new mongodb_1.ObjectId(),
            "addedAt": new Date(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": blogger.name
        };
        const createdPost = yield PostsRepository_1.postsRepo.createPost(newPost);
        return Object.assign(Object.assign({}, createdPost), { extendedLikesInfo: {
                "likesCount": 0,
                "dislikesCount": 0,
                "myStatus": "None",
                "newestLikes": []
            } });
    })
};
