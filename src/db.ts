/**
* src/db.ts
* MIT
*
* long description for the file
*
* @summary short description for the file
* @author Gabriel Oliveira
*
* Created at     : 2019-01-21 15:26:38 
 * Last modified  : 2019-01-21 16:08:45
*/

import { createConnection } from "typeorm";
import { Comment } from "./backend/entities/comment";
import { User } from "./backend/entities/user";

export async function createDbConnection() {
  const DATABASE_HOST = process.env.DATABASE_HOST;
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_USER = process.env.DATABASE_USER;
  const DATABASE_DB = process.env.DATABASE_DB;
  
  console.log(
    `
      host:     ${DATABASE_HOST}
      password: ${DATABASE_PASSWORD}
      user:     ${DATABASE_USER}
      db:       ${DATABASE_DB}
    `
  );
    
  await createConnection({
    type: "postgres",
    host: DATABASE_HOST,
    port: 5432,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_DB,
    entities: [
      Comment,
      User
    ],
    synchronize: true
  });
}
  