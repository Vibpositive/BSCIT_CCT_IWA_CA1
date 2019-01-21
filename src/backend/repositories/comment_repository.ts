// src/backend/repositories/comment_repository.ts
import { getConnection } from "typeorm";
import { Comment } from "../entities/comment";

export function getCommentRepository() {
  return getConnection().getRepository(Comment);
}
