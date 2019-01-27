// /src/backend/entities/vote.ts 
// This file should define the Vote entity and it
// should contain an ID, a reference to the user, a reference to the Link and a boolean flag that
// indicates if the vote is positive or negative

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public vote!: boolean;

  @ManyToOne(type => User, user => user.vote, { primary: true })
  @JoinColumn()
  user!: User;

  @ManyToOne(type => Link, link => link.id, { primary: true })
  @JoinColumn()
  link!: Link;
}