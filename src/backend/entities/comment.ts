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

  @ManyToOne(type => User, user => user.id)
  @JoinColumn()
  public user!: User;

  @ManyToOne(type => Link, link => link.id)
  @JoinColumn()
  public link!: Link;
}