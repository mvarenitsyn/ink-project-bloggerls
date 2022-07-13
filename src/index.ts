import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import {Request, Response} from "express";


const app =  express()
const port = process.env.PORT || 3003

app.use(cors())
app.use(bodyParser({extended: true}))

const bloggers = [
    {
        "id": 1,
        "name": "Vanya",
        "youtubeUrl": "http://someurl"
    }
]


const posts = [
    {
        "id": 1,
        "title": "Post title",
        "shortDescription": "Short description",
        "content": "Some good content",
        "bloggerId": 1,
        "bloggerName": "Vanya"
    }
]

const errMess:any = {
    "errorsMessages": []
}

//Posts API

app.get('/posts', (req:Request, res:Response) => {
    res.status(200).send(posts)
    res.end()
})

app.get('/posts/:id', (req:Request, res:Response) => {
    if(req.params.id.match(/\D/g)) {
        res.status(400)
        res.end()
        return
    }
    const foundIndex = posts.findIndex(item => item.id === +req.params.id)
    if(foundIndex<0) {
        res.status(404)
        res.end()
        return
    }

    res.status(200).send(posts[foundIndex])
    res.end()
})

app.post('/posts', (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const bloggerIndex = bloggers.findIndex(item => item.id === bloggerId)

    if(!title || title.length>30 || !title.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "title" })
    }
    if (!shortDescription || shortDescription.length>100 || !shortDescription.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "shortDescription" })
    }
    if (!content || content.length>1000 || !content.match('[Aa-zZ]+')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "content" })
    }
    if (bloggerIndex<0) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "bloggerIndex" })
    }

    if(errMess.errorsMessages.length>0) {
        res.status(400).json(errMess)
        res.end()
        errMess.errorsMessages = []
        return
    }

    const newPost = {
        "id": +(new Date()),
        "title": title,
        "shortDescription": shortDescription,
        "content": content,
        "bloggerId": bloggerId,
        "bloggerName": bloggers[bloggerIndex].name

    }

    posts.push(newPost)
    res.status(201).send(newPost)
    res.end()


})

app.put('/posts/:id', (req:Request, res:Response) => {
    const {title, shortDescription, content, bloggerId} = req.body
    const bloggerIndex = bloggers.findIndex(item => item.id === bloggerId)
    const postIndex = bloggers.findIndex(item => item.id === +req.params.id)

    if(postIndex<0) {
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
    if (bloggerIndex<0) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "bloggerIndex" })
    }

    if(errMess.errorsMessages.length>0) {
        res.status(400).json(errMess)
        res.end()
        errMess.errorsMessages = []
        return
    }

    const newPost = {
        "id": +(new Date()),
        "title": title,
        "shortDescription": shortDescription,
        "content": content,
        "bloggerId": bloggerId,
        "bloggerName": bloggers[bloggerIndex].name

    }
    posts[postIndex].title = title
    posts[postIndex].shortDescription = shortDescription
    posts[postIndex].content = content
    posts[postIndex].bloggerId = bloggerId

    res.status(204)
    res.end()


})



//Bloggers API
app.get('/bloggers', (req:Request, res:Response) => {
    res.status(200).send(bloggers)
    res.end()
})

app.get('/bloggers/:id', (req:Request, res:Response) => {

    const foundIndex = bloggers.findIndex(item => item.id === +req.params.id)
    if(foundIndex>=0) {
        res.status(200).send(bloggers[foundIndex])
        res.end()
    } else {
        res.status(404)
        res.end()
    }

})



app.delete('/bloggers/:id', (req:Request, res:Response) => {
    const foundIndex = bloggers.findIndex(item => item.id === +req.params.id)
    if(foundIndex>=0) {
        bloggers.splice(foundIndex,1)
        res.status(204)
        res.end()
    } else {
        res.status(404)
        res.end()
    }

})

app.post('/bloggers', (req:Request, res:Response) => {
    const {name, youtubeUrl} = req.body
    if(!name || !name.match('[Aa-zZ]+') || name.length>15) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "name" })
    }
    if (!youtubeUrl || youtubeUrl.length>100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "youtubeUrl" })
    }
    if(errMess.errorsMessages.length>0) {
        res.status(400).json(errMess)
        res.end()
        errMess.errorsMessages = []
        return
    }
    const newBlogger = {
        "id": +(new Date()),
        "name": name,
        "youtubeUrl": youtubeUrl
    }

    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
    res.end()


})

app.put('/bloggers/:id', (req:Request, res:Response) => {
    const {name, youtubeUrl} = req.body
    const foundIndex = bloggers.findIndex(item => item.id === +req.params.id)
    if(foundIndex<0) {
        res.status(404)
        res.end()
        return
    }
    if(!name || !name.match('[Aa-zZ]+') || name.length>15) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "name" })
    }
    if (!youtubeUrl || youtubeUrl.length>100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        errMess.errorsMessages.push({ "message" : "Input error", "field": "youtubeUrl" })
    }
    if(errMess.errorsMessages.length>0) {
        res.status(400).json(errMess)
        res.end()
        errMess.errorsMessages = []
        return
    }

    bloggers[foundIndex].name = req.body.name
    bloggers[foundIndex].youtubeUrl = req.body.youtubeUrl
    res.status(204)
    res.end()


})


app.listen(port, () => {
    console.log("Server is up and running or port: "+port)
})

