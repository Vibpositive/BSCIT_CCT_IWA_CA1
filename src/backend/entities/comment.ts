// /src/backend/entities/comment.ts.
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("text")
  public comment!: string;

  @ManyToOne(type => User, user => user.comment)
  @JoinColumn()
  public user!: User;

  @ManyToOne(type => Link, link => link.comment)
  @JoinColumn()
  public link!: Link;
}