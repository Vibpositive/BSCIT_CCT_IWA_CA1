import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import { authMiddleware } from "../middleware/middleware";

import { User } from "../entities/user"
import { Repository } from "typeorm";

export function getHandlers(userRepo: Repository<User>) {

    const getAllUsersHandler = (req: express.Request, res: express.Response) => {
        (async () => {
            const users = await userRepo.find();
            res.json(users);
        })();
    };

    const getUserById = (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const users = await userRepo.findOne(id);
            res.json(users);
        })();
    };

    // const getMoviesByYearHandler = (req: express.Request, res: express.Response) => {
    //     (async () => {
    //         const year = req.params.year;
    //         const movies = await movieRepo.find({ year: year });
    //         res.json(movies);
    //     })();
    // };

    return {
        getAllUsersHandler: getAllUsersHandler,
        getUserById: getUserById
    };
}


export function getUserController() {

    const userRepository = getUserRepository();
    const router = express.Router();
    const handlers = getHandlers(userRepository);

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };

    router.get("/", handlers.getAllUsersHandler);

    // router.get("/", (req: express.Request, res: express.Response) => {
    //   (async () => {
    //     const users = await userRepository.find();
    //     res.json(users);
    //   })();
    // });

    // router.post("/:id", authMiddleware, (req: any, res: express.Response) => {
    router.post("/:id", handlers.getUserById);
    // router.post("/:id", (req: any, res: express.Response) => {
    //   (async () => {
    //     const id = req.params.id;
    //     const users = await userRepository.findOne(id);
    //     res.json(users);
    //   })();
    // });
    
    router.post("/", (req: any, res: any) => {
        (async () => {

            const newUser = req.body;
            const result = joi.validate(newUser, userDetailsSchema);

            if (result.error) {
                res.status(400).send();
            } else {
                if (!newUser.email || !newUser.password){
                    res.status(400).send("Incorrect info");
                }else{
                    const user = await userRepository.save(newUser);
                    res.json({ ok: "ok" }).send();
                }
            }
        })();
    });
    return router;
}