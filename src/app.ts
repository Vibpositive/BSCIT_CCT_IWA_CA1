require("dotenv").config();
import express from "express";
import * as bodyParser from "body-parser";

import { createDbConnection } from "./db";
import { getCommentController } from "./backend/controllers/comment_controller";
import { getUserController } from "./backend/controllers/user_controller";
import { getLinkController } from "./backend/controllers/link_controller";
import { getAuthController } from "./backend/controllers/auth_controller";

export async function createApp() {
  const ENDPOINT = process.env.ENDPOINT;

  await createDbConnection();
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req: express.Request, res: express.Response) => {
    res.json("This is the home page!");
  });
  
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
