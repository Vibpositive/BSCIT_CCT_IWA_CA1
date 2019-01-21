// /src/backend/entities/vote.ts 
// This file should define the Vote entity and it
// should contain an ID, a reference to the user, a reference to the Link and a boolean flag that
// indicates if the vote is positive or negative

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public user!: User;
    @Column()
    public link!: Link;
    @Column()
    public vote!: boolean;
}