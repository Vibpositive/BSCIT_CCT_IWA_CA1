import * as express from "express";
import jwt from "jsonwebtoken";
import { send_status } from "../../util/error_handler";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const AUTH_SECRET = process.env.AUTH_SECRET;
    const token = req.headers["x-auth-token"];

    if (typeof token !== "string") {
        send_status(400, 'token !== "string"', res);
    } else {
        if (AUTH_SECRET === undefined) {
            send_status(500, 'AUTH_SECRET === undefined', res);
        } else {
            try {
                const obj = jwt.verify(token, AUTH_SECRET) as any;
                (req as any).userId = obj.id;
                next();
            } catch (error) {
                send_status(401, error, res);
            }
        }
    }
}