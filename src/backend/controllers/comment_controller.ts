import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";
import { getUserRepository } from "../repositories/user_repository";
import { authMiddleware } from "../middleware/auth_middleware";
import * as joi from "joi";

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
        
        (async () => {
            
            const result = joi.validate(req.body, commentDetailSchema);
            
            const userId = (req as any).userId;
            const commentBody = req.body;
            
            const user = await userRepository.findOne({ id: userId });
            const link = await linkRepository.findOne({ id: commentBody.linkId });
            
            if (result.error) {
                res.status(400).json({ code: 400, message: "Bad request", reason: result.error.message });
            }else{
                
                if (link && user) {
                    try {
                        // use the following format if repository is of type repository
                        // const newComment = { comment: commentBody.comment, user: { id: userId }, link: { id: commentBody.linkId} };
                        const newComment = { comment: commentBody.comment, user: user, link: link };
                        const comment = await commentRepository.save(newComment);
                        res.json(comment);
                        
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal Server Error", reason: "" });
                    }
                }else{
                    res.status(404).json({ code: 404, message: "Not Found", reason: "Link or User Not Found" });
                }
            }
            
        })();
    };
    
    const updateComment = (req: express.Request, res: express.Response) => {
        
        const commentDetailSchema = joi
        .object({
            comment: joi.string().required(),
        }).required();
        
        const result = joi.validate(req.body, commentDetailSchema);
        
        (async () => {
            
            const userId = (req as any).userId;
            const commentBody = req.body;
            const commentId = req.params.id;
            
            const user      = await userRepository.findOne({ id: userId });
            //Finds a comment only and if only that comment has been created by the current user
            const comment = await commentRepository.findOne({ id: commentId, user: { id: userId }});
            
            if (result.error) {
                console.log(result)
                res.status(400).send("Bad request");
            } else {
                
                if (comment && user) {
                    try {
                        
                        // use the following format if repository is of type repository
                        // const newComment = { comment: commentBody.comment, user: { id: userId }, link: { id: commentBody.linkId} };
                        const newComment = commentBody.comment;
                        comment.comment = newComment;
                        
                        const updatedComment = await commentRepository.save(comment);
                        
                        res.json(updatedComment);
                        
                    } catch (error) {
                        console.log(error);
                        res.status(500).send("Internal Server error")
                    }
                } else {
                    res.status(404).send("Not Found");
                }
            }
            
        })();
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
                    console.log(error);
                    res.status(500).send("Internal Server error");
                }
            } else {
                res.status(400).send("Bad Request");
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
