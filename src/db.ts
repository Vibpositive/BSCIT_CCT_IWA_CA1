import { Comment } from "./backend/entities/comment";

import { User } from "./backend/entities/user";
import { Link } from "./backend/entities/link";
import { Vote } from "./backend/entities/vote";
import { getConnectionManager, ConnectionManager, Connection } from "typeorm";

export async function createDbConnection() {
  const DATABASE_HOST = process.env.DATABASE_HOST;
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_USER = process.env.DATABASE_USER;
  const DATABASE_DB = process.env.DATABASE_DB;
  
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    type: "postgres",
    host: DATABASE_HOST,
    port: 5432,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_DB,
    entities: [
      Comment,
      User,
      Link,
      Vote
    ],
    synchronize: true
  });
  
  await connection.connect();
}