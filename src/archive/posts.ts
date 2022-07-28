import { postsDB } from "../db/db";

export const postsRepository = {
    posts: postsDB,

    getPosts: () => {
        return postsRepository.posts
    },

    getPostById: (id: number) => {
        return postsRepository.posts.find(item => item.id === id)
    },

    deletePostById: (id: number) => {
        postsRepository.posts.splice(postsRepository.posts.findIndex(item => item.id === id), 1)
        return
    },

    updatePostById: (id: number, title: string, shortDescription: string, content: string, bloggerId: number) => {
        const post = postsRepository.getPostById(id)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId = bloggerId
        }
        else return undefined

        return post
    },

    createPost: (title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string) => {
        const newPost = {
            "id": +(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggerName

        }
        postsRepository.posts.push(newPost)
        return newPost
    }

}