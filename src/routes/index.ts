import {Router} from 'express'
import {videoRouter} from "./video-routes";
import {bloggersRouter} from "./bloggers-routes";
import {postsRouter} from "./posts-routes";
import {usersRouter} from "./users-routes";
import {authRoutes} from "./auth-routes";
import {commentsRoutes} from "./comments-routes";
import {testing} from "./testing";
import {securityDevices} from "./security-devices-routes";


export const bloggersPlatform = Router({})

bloggersPlatform.use('/videos', videoRouter)
bloggersPlatform.use('/blogs', bloggersRouter)
bloggersPlatform.use('/posts', postsRouter)
bloggersPlatform.use('/users', usersRouter)
bloggersPlatform.use('/auth', authRoutes)
bloggersPlatform.use('/comments', commentsRoutes)
bloggersPlatform.use('/testing', testing)
bloggersPlatform.use('/security', securityDevices)

