"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const videos_1 = require("../archive/videos");
const utils_1 = require("../utils");
exports.videoRouter = (0, express_1.Router)({});
//videoRouter.use(notBlocked)
exports.videoRouter.get('/', (req, res) => {
    console.log(req.ip);
    res.status(200).send(videos_1.videoRepository.getVideos());
});
exports.videoRouter.get('/:videoId', (req, res) => {
    const video = videos_1.videoRepository.getVideoById(+req.params.videoId);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errorMessages: (0, utils_1.errorsAdapt)(errors.array()) });
        return;
    }
    if (video) {
        res.status(200).send(video);
        return;
    }
    res.status(404);
    res.end();
    return;
});
exports.videoRouter.post('/', (0, express_validator_1.body)('title').isLength({ min: 0, max: 40 }), (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("Err");
        res.status(400).json({ errorMessages: (0, utils_1.errorsAdapt)(errors.array()) });
        res.end();
        return;
    }
    if (req.body.title && req.body.title.length <= 40) {
        res.status(201).send(videos_1.videoRepository.createVideo(req.body.title));
    }
    else {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "title" }] });
    }
});
//Put request
exports.videoRouter.put('/:id', (req, res) => {
    const title = req.body.title;
    if (title && title.length <= 40) {
        videos_1.videoRepository.updateVideoById(+req.params.id, title)
            ? res.status(204)
            : res.status(404);
        res.end();
    }
    else {
        res.status(400).json({ "errorsMessages": [{ "message": "Input error", "field": "title" }] });
        res.end();
    }
});
exports.videoRouter.delete('/:id', (req, res) => {
    videos_1.videoRepository.deleteVideoById(+req.params.id)
        ? res.status(204)
        : res.status(404);
    res.end();
});
