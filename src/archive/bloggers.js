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
exports.bloggersRepository = void 0;
const db_1 = require("../db/db");
exports.bloggersRepository = {
    bloggers: db_1.bloggersDB,
    getBloggers: () => __awaiter(void 0, void 0, void 0, function* () {
        return exports.bloggersRepository.bloggers;
    }),
    getBloggerById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return exports.bloggersRepository.bloggers.find(item => item.id === id);
    }),
    deleteBloggerById: (id) => {
        exports.bloggersRepository.bloggers.splice(exports.bloggersRepository.bloggers.findIndex(item => item.id === id), 1);
        return;
    },
    updateBloggerById: (id, name, youtubeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const blogger = yield exports.bloggersRepository.getBloggerById(id);
        if (blogger) {
            blogger.name = name;
            blogger.youtubeUrl = youtubeUrl;
        }
        else
            return undefined;
        return blogger;
    }),
    createBlogger: (name, youtubeUrl) => {
        const newBlogger = {
            "id": +(new Date()),
            "name": name,
            "youtubeUrl": youtubeUrl
        };
        exports.bloggersRepository.bloggers.push(newBlogger);
        return newBlogger;
    },
};
