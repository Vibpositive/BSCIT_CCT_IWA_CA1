import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";

import { User } from "../entities/user"
import { Repository } from "typeorm";

export function getHandlers(userRepo: Repository<User>) {

    const userRepository = getUserRepository();

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };
    
    const getUserById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const user = await userRepo.findOne({ id: id }, { relations: ["comment", "vote", "link"] });

            if(!user){
                res.status(404).send("Not Found")
            }else{
                res.json(user);
            }
        })();
    };

    const createUser = (req: express.Request, res: express.Response) => {
        (async () => {

            const newUser = req.body;
            const result = joi.validate(newUser, userDetailsSchema);

            if (result.error) {
                res.status(400).send("Bad request");
            } else {
                if (!newUser.email || !newUser.password) {
                    res.status(400).send("Bad request");
                } else {
                    const user = await userRepository.save(newUser);
                    res.json({ user: user.email}).send();
                }
            }
        })();
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