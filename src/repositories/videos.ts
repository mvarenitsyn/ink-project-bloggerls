import {videosDB} from "../db/db";


export const videoRepository = {
    videos: videosDB,

    getVideos: () => {

        return videoRepository.videos
    },

    getVideoById: (id: number) => {
        return videoRepository.videos.find(item => item.id === id)
    },

    deleteVideoById: (id: number) => {
        videoRepository.videos.splice(videoRepository.videos.findIndex(item => item.id === id), 1)
        return videoRepository.videos
    },

    updateVideoById: (id: number, title: string) => {
        const video = videoRepository.getVideoById(id)
        if (video) video.title = title
        else return undefined

        return video
    },

    createVideo: (ititle: string) => {
        const newVideo = {
            id: Number(new Date()),
            title: ititle,
            author: 'it-incubator.eu'
        }
        videoRepository.videos.push(newVideo)
        return newVideo
    }

}


