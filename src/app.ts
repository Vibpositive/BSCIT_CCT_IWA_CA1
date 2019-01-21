//app.ts
import express from "express";
import * as bodyParser from "body-parser";

import { getCommentController } from "./backend/controllers/comment_controller";
import { getUserController } from "./backend/controllers/user_controller";
import { getAuthController } from "./backend/controllers/auth_controller";

import { createDbConnection } from "./db";
export async function createApp() {
  const ENDPOINT = process.env.ENDPOINT;

  await createDbConnection();
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("This is the home page!");
  });

  const commentsController = getCommentController();
  app.use(ENDPOINT + "comments", commentsController);

  const usersController = getUserController();
  app.use(ENDPOINT + "users", usersController);

  const authController = getAuthController();
  app.use(ENDPOINT + "auth", authController);

  // app.listen(APP_PORT, () => {
  //     console.log(`The server is running in port ${APP_PORT}!`);
  // });
  return app;
}
// (async () => {

//     const APP_PORT = process.env.APP_PORT;
//     const ENDPOINT = process.env.ENDPOINT;

//     await createDbConnection();
//     const app = express();

//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: true }));

//     app.get("/", (req: express.Request, res: express.Response) => {
//         res.send("This is the home page!");
//     });

//     const commentsController = getCommentController();
//     app.use(ENDPOINT + "comments", commentsController);

//     const usersController = getUserController();
//     app.use(ENDPOINT + "users", usersController);

//     const authController = getAuthController();
//     app.use(ENDPOINT + "auth", authController);

//     app.listen(APP_PORT, () => {
//         console.log(`The server is running in port ${APP_PORT}!`);
//     });
// })();
