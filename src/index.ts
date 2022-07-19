import express, {NextFunction} from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import {Request, Response} from "express";


import {videoRouter} from "./routes/video-routes";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";


const app =  express()
const port = process.env.PORT || 3003
app.use(cors())
app.use(bodyParser({extended: true}))
app.use('/videos', videoRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


app.listen(port, () => {
    console.log("Server is up and running or port: "+port)
})

