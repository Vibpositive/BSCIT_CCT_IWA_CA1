import * as express from "express";
import { getLinkRepository } from "../repositories/link_repository";
import { getvoteRepository } from "../repositories/vote_repository";
import { getUserRepository } from "../repositories/user_repository";

import * as joi from "joi";

import { Link } from "../entities/Link"
import { Repository, getConnection } from "typeorm";
import { authMiddleware } from "../middleware/middleware";
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
            const users = await linkRepository.findOne({ id: userId}, { relations: ["comment"]});
            res.json(users);
        })();
    };
    
    const createLink = (req: express.Request, res: express.Response) => {
        
        const linkDetailSchema = joi
        .object({
            url: joi.string().required(),
            title: joi.string().required()
        })
        .required();
        
        (async () => {
            const newLink = req.body;
            const userId = (req as any).userId;
            const link = { user: { id: userId }, ...newLink};

            console.log("(req as any).userId");
            console.log((req as any).userId);
            
            const result = joi.validate(newLink, linkDetailSchema);
            
            if (result.error) {
                res.status(400).send("Bad request");
            } else {
                
                try {
                    await linkRepository.save(link);
                    res.json(link).send();
                }
                catch (e) {
                    console.log(e)
                    res.status(500).send("Internal Server Error")
                }
            }
        })();
        
        
    };
    // DELETE /api/v1/links/:id requires user authentication and takes the id of a link via the
    // request URL.
    // A user should not be able to delete a link if he is not the owner of the link.
    const beleteById = (req: express.Request, res: express.Response) => {
        (async () => {
            console.log("DELETE INSIDE CONTROLLER")
            const user_id = (req as any).userId;
            
            const id = req.params.id;
            const link = await linkRepository.findOne({ id: id }, {relations: ["user"]});
            
            if (link){
                try {
                    // TODO: update to remove
                    await linkRepository.delete({id: id, user: {id: user_id}});
                    
                    if (user_id == link.user.id){
                        res.json(link).send();
                    }else{
                        res.status(400).send("Bad request");
                    }
                } catch (error) {
                    console.log(error)
                    res.status(500).send("Internal Server Error")
                }
            }else{
                res.status(404).send("Not Found")
            }
            
        })();
    };
    
    // POST /api/v1/links/:id/upvote
    // requires user authentication and takes the id of a link via
    // the request URL.
    // A user should not be able to vote the same link multiple times.
    const upvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;
            
            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });
            const newVote = { vote: true, user: user, link: link };
            
            if (!link || !user) {
                res.status(400).send("Bad Request");
            }else{
                if(!vote){
                    try {
                        await voteRepository.save(newVote);
                        res.json(newVote);
                    } catch (error) {
                        console.log(error);
                        res.status(500).send("Internal server error");
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
                        res.status(500).send("Internal server error");
                    }
                }
            }
            
        })();
    };

    // POST /api/v1/links/:id/downvote
    // requires user authentication and takes the id of a link
    // via the request URL. A user should not be able to vote the same link multiple times.
    const downvoteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const userId = (req as any).userId;

            const link = await linkRepository.findOne({ id: id });
            const user = await userRepository.findOne({ id: userId });
            const vote = await voteRepository.findOne({ user: { id: userId }, link: { id: link.id } });
            const newVote = { vote: false, user: user, link: link };

            if (!link || !user) {
                res.status(400).send("Bad Request");
            } else {
                if (!vote) {
                    try {
                        await voteRepository.save(newVote);
                        res.json(newVote);
                    } catch (error) {
                        console.log(error);
                        res.status(500).send("Internal server error");
                    }
                } else {
                    try {

                        await getConnection()
                            .createQueryBuilder()
                            .update(Vote)
                            .set({ vote: false })
                            .where("id = :id", { id: vote.id })
                            .execute();
                        res.json(vote);
                        vote.vote = false;
                    } catch (error) {
                        console.log(error);
                        res.status(500).send("Internal server error");
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