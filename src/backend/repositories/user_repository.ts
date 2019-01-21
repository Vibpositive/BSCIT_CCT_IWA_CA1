import { getConnection } from "typeorm";
import { User } from "../entities/user";

export function getUserRepository() {
    return getConnection().getRepository(User)
}