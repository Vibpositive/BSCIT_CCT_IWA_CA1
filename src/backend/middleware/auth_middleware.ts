import * as express from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const AUTH_SECRET = process.env.AUTH_SECRET;
    const token = req.headers["x-auth-token"];

    if (typeof token !== "string") {
        res.status(400).json({ code: 400, message: "Bad request", reason: "" });
    } else {
        if (AUTH_SECRET === undefined) {
            res.status(500).json({ code: 500, message: "Internal Server Error", reason: "" });
        } else {
            try {
                const obj = jwt.verify(token, AUTH_SECRET) as any;
                (req as any).userId = obj.id;
                next();
            } catch (err) {
                res.status(401).json({ code: 401, message: "Forbidden", reason: "" });
            }
        }
    }
    /**/
}