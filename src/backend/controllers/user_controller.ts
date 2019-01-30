import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";

import { User } from "../entities/user"
import { Repository } from "typeorm";
import { send_status } from "../../util/error_handler";

export function getHandlers(userRepo: Repository<User>) {

    const userRepository = getUserRepository();
    
    const getUserById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const user = await userRepo.findOne({ id: id }, { relations: ["comment", "vote", "link"] });

            if(!user){
                send_status(404, "User Not Found", res);
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
            send_status(400, result.error.message, res);
        } else {
            (async () => {

                try {
                    const user = await userRepository.save(req.body);
                    res.json({ user: user.email}).send();
                } catch (error) {
                    send_status(500, error, res);
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