"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const db_1 = require("../db/db");
exports.videoRepository = {
    videos: db_1.videosDB,
    getVideos: () => {
        return exports.videoRepository.videos;
    },
    getVideoById: (id) => {
        return exports.videoRepository.videos.find(item => item.id === id);
    },
    deleteVideoById: (id) => {
        exports.videoRepository.videos.splice(exports.videoRepository.videos.findIndex(item => item.id === id), 1);
        return exports.videoRepository.videos;
    },
    updateVideoById: (id, title) => {
        const video = exports.videoRepository.getVideoById(id);
        if (video)
            video.title = title;
        else
            return undefined;
        return video;
    },
    createVideo: (ititle) => {
        const newVideo = {
            id: Number(new Date()),
            title: ititle,
            author: 'it-incubator.eu'
        };
        exports.videoRepository.videos.push(newVideo);
        return newVideo;
    }
};
