import * as express from "express";
import * as joi from "joi";

import { getLinkRepository } from "../repositories/link_repository";
import { getvoteRepository } from "../repositories/vote_repository";
import { getUserRepository } from "../repositories/user_repository";

import { Repository, getConnection } from "typeorm";
import { authMiddleware } from "../middleware/auth_middleware";

import { Vote } from "../entities/vote";

export function getHandlers(linkRepository: Repository<any>) {
    
    const voteRepository = getvoteRepository();
    const userRepository = getUserRepository();
    
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
                res.status(404).json({ code: 404, message: "Not Found", reason: "Link not found" });
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
            res.status(400).json({ code: 400, message: "Bad request", reason: result.error.message });
        } else {
            (async () => {
                
                const userId = (req as any).userId;
                const link = { user: { id: userId }, ...req.body};
                
                try {
                    await linkRepository.save(link);
                    res.json(link).send();
                }
                catch (error) {
                    console.log(error);
                    res.status(500).json({ code: 500, message: "Internal Server Error", reason: "" });
                }
            })();
        }
    };
    
    const beleteById = (req: express.Request, res: express.Response) => {
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
                        res.status(400).json({ code: 400, message: "Bad request", reason: "You are not the creator" });
                    }
                } catch (error) {
                    console.log(error)
                    res.status(500).json({ code: 500, message: "Internal Server Error", reason: "" });
                }
            }else{
                res.status(404).json({ code: 404, message: "Not Found", reason: "Link Not Found" });
            }
            
        })();
    };
    
    const upvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;
            
            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            
            if (!link || !user) {
                res.status(400).json({ code: 400, message: "Bad Request", reason: "Wrong Parameters" });
            }else{

                const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });
                
                if(!vote){
                    try {
                        const upvotedLink = { vote: true, user: user, link: link };
                        await voteRepository.save(upvotedLink);
                        res.json(upvotedLink);
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal server error", reason: "" });
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
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal server error", reason: "" });
                    }
                }
            }
            
        })();
    };
    
    const downvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;

            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            
            
            if (!link || !user) {
                res.status(400).json({ code: 400, message: "Bad Request", reason: "Wrong Parameters" });
            } else {

                const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });

                if (!vote) {
                    try {
                        const downvotedLink = { vote: false, user: user, link: link };
                        await voteRepository.save(downvotedLink);
                        res.json(downvotedLink);
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal server error", reason: "" });
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
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal server error", reason: "" });
                    }
                }
            }

        })();
    };
    
    return {
        getAllLinksHandler  : getAllLinksHandler,
        getLinkById         : getLinkById,
        createLink          : createLink,
        beleteById          : beleteById,
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
    router.delete("/:id",           authMiddleware, handlers.beleteById);
    
    router.post("/:id/upvote",      authMiddleware, handlers.upvoteLinkById);
    router.post("/:id/downvote",    authMiddleware, handlers.downvoteLinkById);
    
    return router;
}