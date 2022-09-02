import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';

import {connectDB} from "./db/data";

import {bloggersPlatform} from "./routes";
const port = process.env.PORT || 3003

const app =  express()


app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', bloggersPlatform)
app.set('trust proxy', true)

async function main()
{
    await connectDB()
    app.listen(port, () => {
        console.log("Server is up and running or port: " + port)
    })

}

main()