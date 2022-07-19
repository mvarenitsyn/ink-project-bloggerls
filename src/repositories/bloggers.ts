import { bloggersDB } from "../db/db";


export const bloggersRepository = {
    bloggers: bloggersDB,

    getBloggers: () => {
        return bloggersRepository.bloggers
    },

    getBloggerById: (id: number) => {
        return bloggersRepository.bloggers.find(item => item.id === id)
    },

    deleteBloggerById: (id: number) => {
        bloggersRepository.bloggers.splice(bloggersRepository.bloggers.findIndex(item => item.id === id), 1)
        return
    },

    updateBloggerById: (id: number, name:string, youtubeUrl:string) => {
        const blogger = bloggersRepository.getBloggerById(id)
        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl

        }
        else return undefined

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