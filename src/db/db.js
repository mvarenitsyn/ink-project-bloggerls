"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLog = exports.postsDB = exports.bloggersDB = exports.videosDB = void 0;
exports.videosDB = [
    { id: 1, title: 'About JS - 01', author: 'it-incubator.eu' },
    { id: 2, title: 'About JS - 02', author: 'it-incubator.eu' },
    { id: 3, title: 'About JS - 03', author: 'it-incubator.eu' },
    { id: 4, title: 'About JS - 04', author: 'it-incubator.eu' },
    { id: 5, title: 'About JS - 05', author: 'it-incubator.eu' },
];
exports.bloggersDB = [
    {
        "id": 1,
        "name": "Vanya",
        "youtubeUrl": "http://someurl"
    }
];
exports.postsDB = [
    {
        id: 1,
        "title": "Post title",
        "shortDescription": "Short description",
        "content": "Some good content",
        bloggerId: 1,
        "bloggerName": "Vanya"
    }
];
exports.requestLog = [{
        action: '',
        ip: '',
        time: new Date()
    }];
