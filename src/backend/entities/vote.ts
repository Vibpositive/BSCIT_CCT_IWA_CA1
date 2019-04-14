import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public vote!: boolean;

  @ManyToOne(type => User, user => user.vote, { primary: true})
  @JoinColumn()
  user!: User;

  @ManyToOne(type => Link, link => link.id, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn()
  link!: Link;
}