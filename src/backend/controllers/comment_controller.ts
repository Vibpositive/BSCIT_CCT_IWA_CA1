/**
* src/backend/controller/comment_controller.ts
* MIT
* 
* long description for the file
*
* @summary short description for the file
* @author Gabriel Oliveira <ras.vibpositive@gmail.com>
*
* Created at     : 2019-01-21 15:28:26 
* Last modified  : 2019-01-21 16:14:04
*/

import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";
import { getUserRepository } from "../repositories/user_repository";
import { Repository } from "typeorm";
import { authMiddleware } from "../middleware/middleware";
import * as joi from "joi";

export function getHandlers(commentRepository: Repository<any>){
    
    const linkRepository = getLinkRepository();
    const userRepository = getUserRepository();
    
    
    const createComment = (req: express.Request, res: express.Response) => {
        
        /*
        */
        const commentDetailSchema = joi
        .object({
            comment: joi.string().required()
        })
        .required();
        /**/
        
        /*
        const movieSchemaForPost = {
            comment: joi.string().required()
        };
        /* */
        
        (async () => {
            
            const result = joi.validate(req.body, commentDetailSchema);
            
            if (result.error) {
                console.log(result)
                res.status(400).send("Bad request");
            }else{
                
                const linkid = req.params.id
                const userId = (req as any).userId;
                const user = await userRepository.findOne({ id: userId });
                const link = await linkRepository.findOne({ id: linkid });
                
                if (link) {
                    try {
                        // await linkRepository.delete({ id: id, user: { id: user_id } });
                        const comment = { comment: req.body.comment, user: user, link: link }

                        // const newVote = { vote: true, user: user, link: link };

                        // const link = { user: { id: userId }, ...newComment };
                        const comment2 = await commentRepository.save(comment);
                        res.json(comment);
                        
                    } catch (error) {
                        
                        console.log(error);
                        res.status(500).send("Internal Server error")
                        
                    }
                    
                }
            }
            
            
        })();
    };
    
    
    return {
        createComment: createComment
    }
}
// HTTP Method URL Description Is public
// /api/v1/comments POST Creates a new comment No/api/v1/comments/:id PATCH Updates the content of the
// comment
// No
// /api/v1/comments/:id DELETE Deletes a comment No
export function getCommentController() {
    
    const commentRepository = getCommentRepository();
    const router = express.Router();
    const handlers = getHandlers(commentRepository);
    
    router.post("/:id", authMiddleware, handlers.createComment)
    
    router.get("/:id", (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const comments = await commentRepository.findOne(id);
            res.json(comments);
        })();
    });
    
    return router;
}
