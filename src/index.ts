import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

import {connectDB} from "./db/data";

import {bloggersPlatform} from "./routes";


const app =  express()
const port = process.env.PORT || 3003
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', bloggersPlatform)


async function main()
{
    await connectDB()
    app.listen(port, () => {
        console.log("Server is up and running or port: " + port)
    })

}

main()