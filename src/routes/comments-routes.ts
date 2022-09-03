import {Request, Response, Router} from "express";
import {commentsRepo} from "../domain/CommentsBusiness";
import {addUserCredentials, isAuthorized, isValidPost} from "../middleware";
import {body, validationResult} from "express-validator";
import {errorsAdapt, isObjectId} from "../utils";
import {postsBusiness} from "../domain/PostsBusiness";
import {postsRouter} from "./posts-routes";

export const commentsRoutes = Router({})

commentsRoutes.get('/:id', addUserCredentials, async (req: Request, res: Response) => {
    const comment = await commentsRepo.getCommentById(req.params.id, req.currentUser)
    if(comment) {
        res.status(200).json(comment)
        return
    } else {
        res.sendStatus(404)
        return
    }

})

commentsRoutes.delete('/:commentId', isAuthorized, async (req: Request, res: Response) => {

    const comment = isObjectId(req.params.commentId) ? await commentsRepo.getCommentById(req.params.commentId) : undefined

    if(comment) {
        const currentUserId = req.currentUser!._id.toString()
        if(currentUserId === comment.userId) {
            await commentsRepo.deleteComment(req.params.commentId)
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(403)
            return
        }
    } else {
        res.sendStatus(404)
        return
    }

})

commentsRoutes.put('/:commentId', isAuthorized, body('content').isLength({min:20, max:300}),async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
        return
    }

    const comment = isObjectId(req.params.commentId) ? await commentsRepo.getCommentById(req.params.commentId) : undefined

    if (comment) {
        const currentUserId = req.currentUser!._id.toString()
        if (currentUserId === comment.userId) {
            await commentsRepo.updateComment(req.params.commentId, req.body.content)
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(403)
            return
        }
    } else {
        res.sendStatus(404)
        return
    }

})

commentsRoutes.put('/:commentId/like-status', isAuthorized, body('likeStatus').isIn(['Like', 'Dislike', 'None']),
    async (req: Request, res: Response) => {
        const {likeStatus} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        if (req.currentUser) {
            await commentsRepo.setLike(req.params.commentId, likeStatus, req.currentUser)
            res.sendStatus(204)
            return
        }
        res.sendStatus(401)
        return
    })