import * as express from "express";
import * as joi from "joi";

import { getLinkRepository } from "../repositories/link_repository";
import { getvoteRepository } from "../repositories/vote_repository";
import { getUserRepository } from "../repositories/user_repository";

import { Repository, getConnection } from "typeorm";
import { authMiddleware } from "../middleware/auth_middleware";

import { Vote } from "../entities/vote";
import { send_status, codes } from "../../util/error_handler";

export function getHandlers(linkRepository: Repository<any>) {
    
    const getAllLinksHandler = (req: express.Request, res: express.Response) => {
        
        (async () => {
            const links = await linkRepository.find();
            res.json(links);
        })();
    };
    
    const getLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const userId = req.params.id;
            const link = await linkRepository.findOne({ id: userId}, { relations: ["comment"]});

            if(link){
                res.json(link);
            }else{
                send_status(404, "Link not found", res);
            }
        })();
    };
    
    const createLink = (req: express.Request, res: express.Response) => {
        
        const linkDetailSchema = joi
        .object({
            url: joi.string().required(),
            title: joi.string().required()
        })
        .required();
        
        const result = joi.validate(req.body, linkDetailSchema);

        if (result.error) {
            send_status(400, result.error.message, res);
        } else {
            (async () => {
                
                const userId = (req as any).userId;
                const link = { user: { id: userId }, ...req.body};
                
                try {
                    await linkRepository.save(link);
                    res.json(link);
                }
                catch (error) {
                    send_status(500, error, res);
                }
            })();
        }
    };
    
    const deleteByID = (req: express.Request, res: express.Response) => {
        (async () => {

            const user_id = (req as any).userId;
            const id = req.params.id;
            const link = await linkRepository.findOne({ id: id }, {relations: ["user"]});
            
            if (link){
                try {
                    // TODO: update to remove
                    await linkRepository.delete({id: id, user: {id: user_id}});
                    
                    if (user_id == link.user.id){
                        res.json(link);
                    }else{
                        send_status(400, "You are not the creator", res);
                    }
                } catch (error) {
                    send_status(500, error, res);
                }
            }else{
                send_status(404, "Link Not Found", res);
            }
            
        })();
    };
    
    const upvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;
            
            const userRepository = getUserRepository();
            
            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            
            if (!link || !user) {
                send_status(400, "Wrong Paramaters", res);
            }else{

                const voteRepository = getvoteRepository();
                const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });
                
                if(!vote){
                    try {
                        const upvotedLink = { vote: true, user: user, link: link };
                        await voteRepository.save(upvotedLink);
                        res.json(upvotedLink);
                    } catch (error) {
                        send_status(500, error, res);
                    }
                }else{
                    try {
                        await getConnection()
                            .createQueryBuilder()
                            .update(Vote)
                            .set({ vote: true })
                            .where("id = :id", { id: vote.id })
                            .execute();
                            vote.vote = true;
                        res.json(vote);
                    } catch (error) {
                        send_status(500, error, res);
                    }
                }
            }
            
        })();
    };
    
    const downvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;

            const userRepository = getUserRepository();

            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            
            
            if (!link || !user) {
                send_status(400, "Wrong Paramaters", res);
            } else {

                const voteRepository = getvoteRepository();
                const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });

                if (!vote) {
                    try {
                        const downvotedLink = { vote: false, user: user, link: link };
                        await voteRepository.save(downvotedLink);
                        res.json(downvotedLink);
                    } catch (error) {
                        send_status(500, error, res);
                    }
                } else {
                    try {
                        await getConnection()
                            .createQueryBuilder()
                            .update(Vote)
                            .set({ vote: false })
                            .where("id = :id", { id: vote.id })
                            .execute();
                        vote.vote = false;
                        
                        res.json(vote);
                    } catch (error) {
                        send_status(500, error, res);
                    }
                }
            }

        })();
    };
    
    return {
        getAllLinksHandler  : getAllLinksHandler,
        getLinkById         : getLinkById,
        createLink          : createLink,
        deleteByID          : deleteByID,
        upvoteLinkById      : upvoteLinkById,
        downvoteLinkById    : downvoteLinkById,
    };
}


export function getLinkController() {
    
    const linkRepository = getLinkRepository();
    
    const router = express.Router();
    
    const handlers = getHandlers(linkRepository);
    
    router.get("/",                 handlers.getAllLinksHandler);
    router.get("/:id",              handlers.getLinkById);
    
    router.post("/",                authMiddleware, handlers.createLink);
    router.delete("/:id",           authMiddleware, handlers.deleteByID);
    
    router.post("/:id/upvote",      authMiddleware, handlers.upvoteLinkById);
    router.post("/:id/downvote",    authMiddleware, handlers.downvoteLinkById);
    
    return router;
}