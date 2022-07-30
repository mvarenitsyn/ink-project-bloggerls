import {Router} from 'express'
import {videoRouter} from "./video-routes";
import {bloggersRouter} from "./bloggers-routes";
import {postsRouter} from "./posts-routes";
import {usersRouter} from "./users-routes";
import {authRoutes} from "./auth-routes";

export const bloggersPlatform = Router({})

bloggersPlatform.use('/videos', videoRouter)
bloggersPlatform.use('/bloggers', bloggersRouter)
bloggersPlatform.use('/posts', postsRouter)
bloggersPlatform.use('/users', usersRouter)
bloggersPlatform.use('/auth', authRoutes)