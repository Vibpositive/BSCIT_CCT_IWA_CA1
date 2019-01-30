import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";
import { getUserRepository } from "../repositories/user_repository";
import { authMiddleware } from "../middleware/auth_middleware";
import * as joi from "joi";
import { send_status } from "../../util/error_handler";

export function getHandlers(){
    
    const linkRepository    = getLinkRepository();
    const userRepository    = getUserRepository();
    const commentRepository = getCommentRepository();
    
    const createComment = (req: express.Request, res: express.Response) => {
        
        const commentDetailSchema = joi
        .object({
            comment: joi.string().required(),
            linkId: joi.number().greater(0).required()
        }).required();
        
        
        const result = joi.validate(req.body, commentDetailSchema);
        
        if (result.error) {
            
            send_status(400, result.error.message, res);

        }else{
            
            (async () => {
                
                const userId = (req as any).userId
                const user = await userRepository.findOne({ id: userId });
                const link = await linkRepository.findOne({ id: req.body.linkId });
                
                if (link && user) {
                    try {
                        // use the following format if repository is of type repository
                        // const newComment = { comment: req.body.comment, user: { id: userId }, link: { id: req.body.linkId} };
                        const newComment = { comment: req.body.comment, user: user, link: link };
                        const comment = await commentRepository.save(newComment);
                        res.json(comment);
                        
                    } catch (error) {
                        send_status(500, error, res);
                    }
                }else{
                    send_status(404, link == null ? "link is null" : "user is null", res);
                }
                    
            })();
        }

    };
    
    const updateComment = (req: express.Request, res: express.Response) => {
        
        const commentDetailSchema = joi
        .object({
            comment: joi.string().required(),
        }).required();
        
        const result = joi.validate(req.body, commentDetailSchema);
        

        if (result.error) {
            send_status(400, result.error.message, res);
        } else {
            (async () => {
                
                const userId = (req as any).userId;
                const commentId = req.params.id;
                const user      = await userRepository.findOne({ id: userId });
                const comment = await commentRepository.findOne({ id: commentId, user: { id: userId }});
                
                if (comment && user) {
                    try {
                        
                        // use the following format if repository is of type repository
                        // const newComment = { comment: req.body.comment, user: { id: userId }, link: { id: req.body.linkId} };
                        const newComment = req.body.comment;
                        comment.comment = newComment;
                        
                        const updatedComment = await commentRepository.save(comment);
                        
                        res.json(updatedComment);
                        
                    } catch (error) {
                        send_status(500, error, res);
                    }
                } else {
                    send_status(404, comment == null ? "comment is null" : "user is null", res);
                }
                
            })();
        }
        
    }
    
    const deleteComment = (req: express.Request, res: express.Response) => {
        (async () => {
            
            const userId = (req as any).userId;
            const commentId = req.params.id;
            
            const user = await userRepository.findOne({ id: userId });
            const comment = await commentRepository.findOne({ id: commentId, user: { id: userId } });
            
            if (comment && user) {
                try {
                    const deletedEntry = await commentRepository.remove(comment);
                    res.json(deletedEntry);
                } catch (error) {
                    send_status(500, error, res);
                }
            } else {
                send_status(404, comment == null ? "comment is null" : "user is null", res);
            }
            
        })();
    };
    
    return {
        createComment: createComment,
        updateComment: updateComment,
        deleteComment: deleteComment,
    }
}

export function getCommentController() {
    
    const router = express.Router();
    const handlers = getHandlers();
    
    router.post("/",        authMiddleware, handlers.createComment)
    router.patch("/:id",    authMiddleware, handlers.updateComment)
    router.delete("/:id",   authMiddleware, handlers.deleteComment)
    
    return router;
}
