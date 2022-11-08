"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
exports.postsRepository = {
    posts: db_1.postsDB,
    getPosts: () => {
        return exports.postsRepository.posts;
    },
    getPostById: (id) => {
        return exports.postsRepository.posts.find(item => item.id === id);
    },
    deletePostById: (id) => {
        exports.postsRepository.posts.splice(exports.postsRepository.posts.findIndex(item => item.id === id), 1);
        return;
    },
    updatePostById: (id, title, shortDescription, content, bloggerId) => {
        const post = exports.postsRepository.getPostById(id);
        if (post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.bloggerId = bloggerId;
        }
        else
            return undefined;
        return post;
    },
    createPost: (title, shortDescription, content, bloggerId, bloggerName) => {
        const newPost = {
            "id": +(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggerName
        };
        exports.postsRepository.posts.push(newPost);
        return newPost;
    }
};
