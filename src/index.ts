import express, {NextFunction} from 'express'
import cors from 'cors'
import bodyParser from "body-parser";



import {videoRouter} from "./routes/video-routes";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {connectDB} from "./db/data";


const app =  express()
const port = process.env.PORT || 3003
app.use(cors())
app.use(bodyParser({extended: true}))
app.use('/videos', videoRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


async function main()
{
    await connectDB()
    app.listen(port, () => {
        console.log("Server is up and running or port: " + port)
    })

}

main()