import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";

export function getAuthController() {
    const AUTH_SECRET = process.env.AUTH_SECRET;
    const userRepository = getUserRepository();
    const router = express.Router();
    
    const schema = joi.object({
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2 }).required()
    }).required();
    
    router.post("/login", (req: any, res: any) => {
        (async () => {
            const userDetails = req.body;
            
            joi.validate(userDetails, schema, function (err: any, value: any) {
                if (err) {
                    res.status(401).send("Unauthorized");
                }else{
                    (async () => {
                        const match = await userRepository.findOne(userDetails);
                        
                        if (match === undefined) {
                            res.status(401).send("Unauthorized");
                        } else {
                            if (AUTH_SECRET === undefined) {
                                res.status(500).send("Internal error server");
                            } else {
                                const token = jwt.sign({ id: match.id }, AUTH_SECRET);
                                res.json({ token: token }).send();
                            }
                        }
                    })();
                }
            });
        })();
    });
    return router;
}