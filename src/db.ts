import { createConnection } from "typeorm";
import { Comment } from "./backend/entities/comment";
import { User } from "./backend/entities/user";
import { Link } from "./backend/entities/link";
import { Vote } from "./backend/entities/vote";

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
      User,
      Link,
      Vote
    ],
    synchronize: true
  });
}
  