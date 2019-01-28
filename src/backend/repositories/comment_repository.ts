import { getConnection } from "typeorm";
import { Comment } from "../entities/comment";

export function getCommentRepository() {
  return getConnection().getRepository(Comment);
}
