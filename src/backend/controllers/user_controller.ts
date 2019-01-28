import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";

import { User } from "../entities/user"
import { Repository } from "typeorm";

export function getHandlers(userRepo: Repository<User>) {

    const userRepository = getUserRepository();
    
    const getUserById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const user = await userRepo.findOne({ id: id }, { relations: ["comment", "vote", "link"] });

            if(!user){
                res.status(404).json({ code: 404, message: "Bad request", reason: "User not found" });
            }else{
                res.json(user);
            }
        })();
    };

    const createUser = (req: express.Request, res: express.Response) => {
        
        const userDetailsSchema = joi
        .object({
            password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            email: joi.string().email({ minDomainAtoms: 2 }).required()
        }).required();

        const result = joi.validate(req.body, userDetailsSchema);

        if (result.error) {
            res.status(400).json({ code: 400, message: "Bad request", reason: result.error.message });
        } else {
            (async () => {

                try {
                    const user = await userRepository.save(req.body);
                    res.json({ user: user.email}).send();
                } catch (error) {
                    res.status(500).json({ code: 500, message: "Internal Server Error"});
                }
            })();
        }
    };
        
    return {
        getUserById:    getUserById,
        createuser:     createUser
    };
}


export function getUserController() {

    const userRepository    = getUserRepository();
    const router            = express.Router();
    const handlers          = getHandlers(userRepository);
    
    router.post("/",    handlers.createuser);
    router.get("/:id",  handlers.getUserById);
    
    return router;
}