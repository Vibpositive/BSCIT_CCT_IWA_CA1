// /src/backend/entities/user.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Vote } from "./vote";
import { Link } from "./link";
import { Comment } from "./comment";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column()
  public email!: string;
  @Column()
  public password!: string;
  
  @OneToMany(() => Link, (link: Link) => link.user )
  public links: Link[];

  @OneToMany(type => Comment, comment => comment.user)
  public comment!: Comment[];

  @OneToMany(type => Vote, vote => vote.user)
  public vote!: Vote[];
}
