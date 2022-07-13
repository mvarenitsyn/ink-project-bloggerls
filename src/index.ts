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
    if(name===null || name.length>15) {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "name" }] })
        res.end()
        return
    }
    else if (youtubeUrl===null || youtubeUrl.length>100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "youtubeUrl" }] })
        res.end()
        return
    } else {
        const newBlogger = {
            "id": +(new Date()),
            "name": name,
            "youtubeUrl": youtubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
        res.end()
        return
    }
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
    if(name===null || name.length>15) {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "name" }] })
        res.end()
        return
    }
    else if (youtubeUrl===null || youtubeUrl.length>100 || !youtubeUrl.match('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')) {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "youtubeUrl" }] })
        res.end()
        return
    } else {

        bloggers[foundIndex].name = req.body.name
        bloggers[foundIndex].youtubeUrl = req.body.youtubeUrl
        res.status(204)
        res.end()
        return
    }
    res.end()


})


app.listen(port, () => {
    console.log("Server is up and running or port: "+port)
})