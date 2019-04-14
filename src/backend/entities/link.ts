// /src/backend/entities/link.ts.
// This file should define the Link entity. 
// It should contain an ID, a reference to the User an URL and a title.

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import { Vote } from "./vote";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public url!: string;

  @Column()
  public title!: string;

  @ManyToOne(type => User, (user: User) => user.link )
  @JoinColumn()
  public user!: User;
  
  @OneToMany(type => Comment, comment => comment.link)
  public comment!: Comment;

  @OneToMany(type => Vote, vote => vote.link)
  public vote!: Vote;
}