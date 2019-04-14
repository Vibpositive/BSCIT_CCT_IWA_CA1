import { getConnection } from "typeorm";
import { Link } from "../entities/link";

export function getLinkRepository() {
    return getConnection().getRepository(Link);
}
