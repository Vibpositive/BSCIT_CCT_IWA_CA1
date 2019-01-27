import { getConnection } from "typeorm";
import { Vote } from "../entities/vote";

export function getvoteRepository() {
  return getConnection().getRepository(Vote);
}
