//app.ts
import express from "express";
import * as bodyParser from "body-parser";

import { getCommentController } from "./backend/controllers/comment_controller";
import { getUserController } from "./backend/controllers/user_controller";
import { getAuthController } from "./backend/controllers/auth_controller";

import { createDbConnection } from "./db";
import { getLinkRepository } from "./backend/repositories/link_repository";
import { getLinkController } from "./backend/controllers/link_controller";
export async function createApp() {
  const ENDPOINT = process.env.ENDPOINT;

  await createDbConnection();
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("This is the home page!");
  });

  /*
  */
  app.all('*', printUrl);

  function printUrl(req: express.Request, res:any, next:any) {
    console.log(req.method + " on: " + req.path);
    next();
  }
  /**/

  const linksController = getLinkController();
  app.use(ENDPOINT + "links", linksController);

  const commentsController = getCommentController();
  app.use(ENDPOINT + "comments", commentsController);
  
  const usersController = getUserController();
  app.use(ENDPOINT + "users", usersController);
  
  const authController = getAuthController();
  app.use(ENDPOINT + "auth", authController);
  
  return app;
}