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
exports.postsRepo = void 0;
const data_1 = require("../db/data");
exports.postsRepo = {
    getPosts: (pageNum, pageSize, bloggerId) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = bloggerId ? { bloggerId: bloggerId } : {};
        const resultCount = yield data_1.PostModel.countDocuments(filter);
        const posts = yield data_1.PostModel.find(filter).select('-_id -__v')
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec();
        return [resultCount, posts];
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        return data_1.PostModel.findOne(filter).select('-_id -__v').lean().exec();
    }),
    deletePostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        return data_1.PostModel.deleteOne(filter);
    }),
    updatePostById: (id, title, shortDescription, content, bloggerId, bloggerName) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        yield data_1.PostModel.updateOne(filter, {
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
        });
        return;
    }),
    createPost: (post) => __awaiter(void 0, void 0, void 0, function* () {
        //await PostModel.insertOne(post)
        const newPost = new data_1.PostModel(post);
        return yield newPost.save().then(result => {
            return {
                "id": post.id,
                "addedAt": post.addedAt,
                "title": post.title,
                "shortDescription": post.shortDescription,
                "content": post.content,
                "bloggerId": post.bloggerId,
                "bloggerName": post.bloggerName
            };
        }).catch(err => {
            return {};
        });
    }),
};
