import { bloggersDB } from "../db/db";


export const bloggersRepository = {
    bloggers: bloggersDB,

    getBloggers: async () => {
        return bloggersRepository.bloggers
    },

    getBloggerById: async (id: number) => {
        return bloggersRepository.bloggers.find(item => item.id === id)
    },

    deleteBloggerById: (id: number) => {
        bloggersRepository.bloggers.splice(bloggersRepository.bloggers.findIndex(item => item.id === id), 1)
        return
    },

    updateBloggerById: async (id: number, name: string, youtubeUrl: string) => {
        const blogger = await bloggersRepository.getBloggerById(id)
        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl

        } else return undefined

        return blogger
    },

    createBlogger: (name:string, youtubeUrl:string) => {
        const newBlogger = {
            "id": +(new Date()),
            "name": name,
            "youtubeUrl": youtubeUrl
        }

        bloggersRepository.bloggers.push(newBlogger)

        return newBlogger
    },

}