import {NextFunction, Request, Response, Router} from "express";

import { postsRepository } from "../repositories/posts";
import { bloggersRepository } from "../repositories/bloggers";

export const postsRouter = Router({})
const errMess:any = {
    "errorsMessages": []
}
postsRouter.get('/', (req:Request, res:Response) => {
    res.status(200).send(postsRepository.getPosts())
    res.end()
})

postsRouter.get('/:id', (req:Request, res:Response) => {
    if(req.params.id.match(/\D/g)) {
        res.status(400)
        res.end()
        return
    }
    const post = postsRepository.getPostById(+req.params.id)
    if(!post) {
        res.status(404)
        res.end()
        return
    }

    res.status(200).send(post)
    res.end()
})

postsRouter.post('/', (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const blogger = bloggersRepository.getBloggerById(bloggerId)

    if(!title || title.length>30 || !title.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "title" })
    }
    if (!shortDescription || shortDescription.length>100 || !shortDescription.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "shortDescription" })
    }
    if (!content || content.length>1000 || !content.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "content" })
    }


    if (!blogger) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "bloggerId" })
    }

    if(errMess.errorsMessages.length>0) {
        res.status(400).json(errMess)
        res.end()
        errMess.errorsMessages = []
        return
    }

    blogger && res.status(201).send(postsRepository.createPost(title, shortDescription, content, bloggerId, blogger.name))
    res.end()


})

postsRouter.put('/:id', (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const blogger = bloggersRepository.getBloggerById(bloggerId)
    const post = postsRepository.getPostById(+req.params.id)

    if(!post) {
        res.status(404)
        res.end()
        return
    }

    if(!title || title.length>30 || !title.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "title" })
    }
    if (!shortDescription || shortDescription.length>100 || !shortDescription.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "shortDescription" })
    }
    if (!content || content.length>1000 || !content.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "content" })
    }
    if (!blogger) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "bloggerId" })
    }



    blogger && postsRepository.updatePostById(+req.params.id, title, shortDescription, content, bloggerId)
    res.status(204)
    res.end()


})

postsRouter.delete('/:id', (req:Request, res:Response) => {
    const post = postsRepository.getPostById(+req.params.id)
    if(post) {
        postsRepository.deletePostById(+req.params.id)
        res.status(204)
        res.end()
    } else {
        res.status(404)
        res.end()
    }

})