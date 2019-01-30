import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";
import { send_status } from "../../util/error_handler";

export function getAuthController() {
    const AUTH_SECRET = process.env.AUTH_SECRET;
    const NODE_ENV = process.env.NODE_ENV;

    const userRepository = getUserRepository();
    const router = express.Router();

    const schema = joi.object({
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2 }).required()
    }).required();

    router.post("/login", (req: any, res: any) => {
        (async () => {
            const userDetails = req.body;
            
            joi.validate(userDetails, schema, function (error: any, value: any) {
                if (error) {
                    send_status(401, error.message, res);
                } else {
                    (async () => {
                        const match = await userRepository.findOne(userDetails);
                        
                        if (match === undefined) {
                            send_status(401, "User not found", res);
                        } else {
                            if (AUTH_SECRET === undefined) {
                                send_status(500, "AUTH_SECRE undefined", res);
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