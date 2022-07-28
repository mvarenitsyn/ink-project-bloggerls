import {Request, Response, Router} from "express";
import { body, validationResult} from 'express-validator'

import {videoRepository} from "../archive/videos";

import {errorsAdapt} from "../utils";


export const videoRouter = Router({})

//videoRouter.use(notBlocked)

videoRouter.get('/', (req: Request, res: Response) => {
    console.log(req.ip)
    res.status(200).send(videoRepository.getVideos());
})

videoRouter.get('/:videoId', (req: Request, res: Response) => {
    const video = videoRepository.getVideoById(+req.params.videoId)
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errorMessages: errorsAdapt(errors.array())})
        return

    }
    if (video) {
        res.status(200).send(video)
        return
    }
    res.status(404)
    res.end()
    return

})

videoRouter.post('/', body('title').isLength({min:0, max:40}), (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log("Err")
        res.status(400).json({errorMessages: errorsAdapt(errors.array())})
        res.end()
        return
    }

    if (req.body.title && req.body.title.length <= 40) {

        res.status(201).send(videoRepository.createVideo(req.body.title))
    } else {
        res.status(400).json({"errorsMessages": [{"message": "Input error", "field": "title"}]})
    }
})

//Put request
videoRouter.put('/:id', (req: Request, res: Response) => {
    const title = req.body.title

    if (title && title.length <= 40) {
        videoRepository.updateVideoById(+req.params.id, title)
            ? res.status(204)
            : res.status(404)
        res.end()
    } else {
        res.status(400).json({"errorsMessages": [{"message": "Input error", "field": "title"}]})
        res.end()
    }


})

videoRouter.delete('/:id', (req: Request, res: Response) => {
    videoRepository.deleteVideoById(+req.params.id)
        ? res.status(204)
        : res.status(404)
    res.end()

})