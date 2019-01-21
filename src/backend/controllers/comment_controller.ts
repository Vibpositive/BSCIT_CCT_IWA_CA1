/**
 * src/backend/controller/comment_controller.ts
 * MIT
 * 
 * long description for the file
 *
 * @summary short description for the file
 * @author Gabriel Oliveira <ras.vibpositive@gmail.com>
 *
 * Created at     : 2019-01-21 15:28:26 
 * Last modified  : 2019-01-21 16:14:04
 */

import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";

export function getCommentController() {
    const commentRepository = getCommentRepository();
    const router = express.Router();

    router.get("/", (req: express.Request, res: express.Response) => {
        (async () => {
            const comments = await commentRepository.find();
            res.json(comments);
        })();
    });

    router.get("/:id", (req: express.Request, res: express.Response) => {
        (async () => {
            const id = req.params.id;
            const comments = await commentRepository.findOne(id);
            res.json(comments);
        })();
    });

    return router;
}
